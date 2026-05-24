import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Alignment,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Image,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  SourceEditing,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableToolbar,
  Underline,
  Undo,
  type Editor,
  type FileLoader,
} from "ckeditor5";
import toast from "react-hot-toast";
import Api from "@/services/Api";
import { normalizeEditorImageSources, normalizeEditorImageUrl } from "@/utils/editorImages";
import "@/assets/shared/css/fonts.css";
import "ckeditor5/ckeditor5.css";

type Props = {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  maxImageCount?: number;
  maxInlineImagesTotalSize?: number;
  uploadEndpoint?: string;
  onPendingUploadsChange?: (count: number) => void;
};

type UploadResult = {
  default: string;
};

const MAX_INLINE_IMAGE_SIZE = 500 * 1024;
const MAX_INLINE_IMAGE_SIZE_LABEL = "500KB";
const MAX_STORAGE_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_STORAGE_IMAGE_SIZE_LABEL = "2MB";
const DEFAULT_MAX_INLINE_IMAGE_COUNT = 8;
const DEFAULT_MAX_INLINE_IMAGES_TOTAL_SIZE = 4 * 1024 * 1024;
const EDITOR_FONT_FAMILIES = [
  "default",
  "Soria, serif",
  "Satoshi, Arial, Helvetica, sans-serif",
  "Arial, Helvetica, sans-serif",
  "Georgia, serif",
  '"Times New Roman", Times, serif',
  '"Courier New", Courier, monospace',
];

type EditorUploadResponse = {
  url?: string;
  default?: string;
  data?: {
    url?: string;
  };
};

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${Math.round((bytes / (1024 * 1024)) * 10) / 10}MB`;
  }

  return `${Math.round(bytes / 1024)}KB`;
}

function getEditorImages(content: string) {
  if (!content || typeof DOMParser === "undefined") {
    return [];
  }

  const doc = new DOMParser().parseFromString(content, "text/html");
  return Array.from(doc.querySelectorAll("img"));
}

function estimateBase64ImageSize(src: string) {
  if (!src.startsWith("data:image/")) {
    return 0;
  }

  const base64 = src.split(",")[1] || "";
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function getImageFileExtension(mimeType: string) {
  const extension = mimeType.split("/")[1]?.toLowerCase() || "png";
  return extension === "jpeg" ? "jpg" : extension;
}

function dataUrlToFile(dataUrl: string, index: number) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  const [, mimeType, base64] = match;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], `editor-image-${Date.now()}-${index}.${getImageFileExtension(mimeType)}`, {
    type: mimeType,
  });
}

async function uploadImageToStorage(file: File, uploadEndpoint: string) {
  const formData = new FormData();
  formData.append("upload", file);

  const res = await Api.post<EditorUploadResponse>(uploadEndpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const uploadedUrl = res.data.url || res.data.default || res.data.data?.url;

  if (!uploadedUrl) {
    throw new Error("Response upload gambar tidak memiliki URL.");
  }

  return normalizeEditorImageUrl(uploadedUrl);
}

function injectEditorStyles() {
  const styleId = "ckeditor-admin-runtime-styles";

  if (document.getElementById(styleId)) {
    return;
  }

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .admin-rich-editor {
      width: 100%;
    }

    .admin-rich-editor .ck.ck-editor {
      width: 100%;
    }

    .admin-rich-editor .ck.ck-toolbar {
      border-color: #d9e0ec;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    .admin-rich-editor .ck.ck-editor__main {
      min-height: var(--admin-editor-min-height);
      height: var(--admin-editor-height);
      max-height: var(--admin-editor-max-height);
      resize: vertical;
      display: flex;
      overflow: auto;
    }

    .admin-rich-editor .ck.ck-editor__main > .ck-editor__editable {
      flex: 1 1 auto;
      min-height: 100%;
      height: auto;
      resize: none;
      overflow: auto;
      border-color: #d9e0ec;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-shadow: none;
    }

    .admin-rich-editor .ck.ck-editor__editable_inline {
      padding: 18px 22px;
      color: #111827;
      font-family: "Satoshi", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 15px;
      line-height: 1.7;
    }

    .admin-rich-editor .ck.ck-editor__editable_inline h1,
    .admin-rich-editor .ck.ck-editor__editable_inline h2,
    .admin-rich-editor .ck.ck-editor__editable_inline h3,
    .admin-rich-editor .ck.ck-editor__editable_inline h4,
    .admin-rich-editor .ck.ck-editor__editable_inline h5,
    .admin-rich-editor .ck.ck-editor__editable_inline h6,
    .admin-rich-editor .ck.ck-editor__editable_inline p,
    .admin-rich-editor .ck.ck-editor__editable_inline li,
    .admin-rich-editor .ck.ck-editor__editable_inline blockquote {
      font-family: inherit;
    }

    .admin-rich-editor .ck-content img {
      max-width: 100%;
      height: auto;
    }

    .dark .admin-rich-editor .ck.ck-toolbar,
    .dark .admin-rich-editor .ck.ck-editor__main > .ck-editor__editable {
      border-color: #334155;
    }
  `;
  document.head.appendChild(style);
}

export default function CKEditorField({
  value,
  onChange,
  placeholder = "Write something...",
  height = "280px",
  minHeight = "220px",
  maxHeight,
  maxImageCount = DEFAULT_MAX_INLINE_IMAGE_COUNT,
  maxInlineImagesTotalSize = DEFAULT_MAX_INLINE_IMAGES_TOTAL_SIZE,
  uploadEndpoint,
  onPendingUploadsChange,
}: Props) {
  const valueRef = useRef(value);
  const pendingUploadRef = useRef({ count: 0, size: 0 });
  const pendingUploadCountRef = useRef(0);
  const limitsRef = useRef({ maxImageCount, maxInlineImagesTotalSize });
  const uploadEndpointRef = useRef(uploadEndpoint);
  const onPendingUploadsChangeRef = useRef(onPendingUploadsChange);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const resizeFrameRef = useRef<number | null>(null);
  const [editorHeight, setEditorHeight] = useState(height);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    setEditorHeight(height);
  }, [height]);

  useEffect(() => {
    limitsRef.current = { maxImageCount, maxInlineImagesTotalSize };
  }, [maxImageCount, maxInlineImagesTotalSize]);

  useEffect(() => {
    uploadEndpointRef.current = uploadEndpoint;
  }, [uploadEndpoint]);

  useEffect(() => {
    onPendingUploadsChangeRef.current = onPendingUploadsChange;
  }, [onPendingUploadsChange]);

  useEffect(() => {
    injectEditorStyles();
  }, []);

  useEffect(() => {
    return () => {
      resizeObserverRef.current?.disconnect();

      if (resizeFrameRef.current) {
        cancelAnimationFrame(resizeFrameRef.current);
      }

      onPendingUploadsChangeRef.current?.(0);
    };
  }, []);

  const reportPendingUpload = useCallback((delta: number) => {
    pendingUploadCountRef.current = Math.max(0, pendingUploadCountRef.current + delta);
    onPendingUploadsChangeRef.current?.(pendingUploadCountRef.current);
  }, []);

  const watchEditorResize = useCallback((editorMainElement: HTMLElement | null) => {
    if (!editorMainElement || typeof ResizeObserver === "undefined") {
      return;
    }

    resizeObserverRef.current?.disconnect();

    resizeObserverRef.current = new ResizeObserver(([entry]) => {
      const nextHeight = Math.round(entry.contentRect.height);

      if (!nextHeight) {
        return;
      }

      if (resizeFrameRef.current) {
        cancelAnimationFrame(resizeFrameRef.current);
      }

      resizeFrameRef.current = requestAnimationFrame(() => {
        setEditorHeight(`${nextHeight}px`);
      });
    });

    resizeObserverRef.current.observe(editorMainElement);
  }, []);

  const migrateInlineImagesToStorage = useCallback(
    async (editor: Editor) => {
      if (!uploadEndpoint) {
        return;
      }

      const content = editor.getData();
      const normalizedContent = normalizeEditorImageSources(content);

      if (normalizedContent !== content) {
        editor.setData(normalizedContent);
        valueRef.current = normalizedContent;
        onChange(normalizedContent);
      }

      if (!normalizedContent.includes("data:image/") || typeof DOMParser === "undefined") {
        return;
      }

      const doc = new DOMParser().parseFromString(normalizedContent, "text/html");
      const inlineImages = Array.from(doc.querySelectorAll("img")).filter((image) =>
        image.getAttribute("src")?.startsWith("data:image/")
      );

      if (!inlineImages.length) {
        return;
      }

      try {
        for (const [index, image] of inlineImages.entries()) {
          const src = image.getAttribute("src") || "";
          const file = dataUrlToFile(src, index);

          if (!file) {
            continue;
          }

          if (file.size > MAX_STORAGE_IMAGE_SIZE) {
            throw new Error(`Gambar lama berukuran ${formatBytes(file.size)}, melebihi ${MAX_STORAGE_IMAGE_SIZE_LABEL}.`);
          }

          reportPendingUpload(1);

          try {
            const uploadedUrl = await uploadImageToStorage(file, uploadEndpoint);
            image.setAttribute("src", uploadedUrl);
          } finally {
            reportPendingUpload(-1);
          }
        }

        const updatedContent = doc.body.innerHTML;
        editor.setData(updatedContent);
        valueRef.current = updatedContent;
        onChange(updatedContent);
      } catch (error) {
        console.error(error);
        toast.error("Sebagian gambar lama masih base64. Upload ulang gambar jika submit masih terlalu besar.");
      }
    },
    [onChange, reportPendingUpload, uploadEndpoint]
  );

  const uploadAdapterPlugin = useMemo(
    () =>
      function InlineImageUploadAdapter(editor: Editor) {
        const fileRepository = editor.plugins.get("FileRepository");

        fileRepository.createUploadAdapter = (loader: FileLoader) => ({
          async upload(): Promise<UploadResult> {
            const file = await loader.file;

            if (!file) {
              throw new Error("Upload gambar gagal. Silakan coba lagi.");
            }

            if (!file.type.startsWith("image/")) {
              toast.error("File harus berupa gambar.");
              throw new Error("File harus berupa gambar.");
            }

            const activeUploadEndpoint = uploadEndpointRef.current;
            const maxImageSize = activeUploadEndpoint ? MAX_STORAGE_IMAGE_SIZE : MAX_INLINE_IMAGE_SIZE;
            const maxImageSizeLabel = activeUploadEndpoint
              ? MAX_STORAGE_IMAGE_SIZE_LABEL
              : MAX_INLINE_IMAGE_SIZE_LABEL;

            if (file.size > maxImageSize) {
              toast.error(
                `Ukuran tiap gambar maksimal ${maxImageSizeLabel}. ${file.name} berukuran ${formatBytes(file.size)}.`
              );
              throw new Error("Ukuran gambar terlalu besar.");
            }

            if (activeUploadEndpoint) {
              reportPendingUpload(1);

              try {
                const uploadedUrl = await uploadImageToStorage(file, activeUploadEndpoint);

                return { default: uploadedUrl };
              } finally {
                reportPendingUpload(-1);
              }
            }

            const existingImages = getEditorImages(valueRef.current);
            const existingInlineSize = existingImages.reduce(
              (total, image) => total + estimateBase64ImageSize(image.getAttribute("src") || ""),
              0
            );
            const pending = pendingUploadRef.current;
            const { maxImageCount: imageCountLimit, maxInlineImagesTotalSize: totalSizeLimit } =
              limitsRef.current;
            const nextImageCount = existingImages.length + pending.count + 1;
            const nextInlineSize = existingInlineSize + pending.size + file.size;

            if (nextImageCount > imageCountLimit) {
              toast.error(`Maksimal ${imageCountLimit} gambar dalam satu editor.`);
              throw new Error("Jumlah gambar melebihi batas.");
            }

            if (nextInlineSize > totalSizeLimit) {
              toast.error(
                `Total gambar inline maksimal ${formatBytes(totalSizeLimit)}. Saat ini akan menjadi ${formatBytes(nextInlineSize)}.`
              );
              throw new Error("Total ukuran gambar melebihi batas.");
            }

            pendingUploadRef.current = {
              count: pending.count + 1,
              size: pending.size + file.size,
            };
            reportPendingUpload(1);

            try {
              const dataUrl = await readFileAsDataUrl(file);

              return { default: dataUrl };
            } finally {
              pendingUploadRef.current = {
                count: Math.max(0, pendingUploadRef.current.count - 1),
                size: Math.max(0, pendingUploadRef.current.size - file.size),
              };
              reportPendingUpload(-1);
            }
          },
          abort() {
            return undefined;
          },
        });
      },
    [reportPendingUpload]
  );

  const editorConfig = useMemo(
    () => ({
      licenseKey: "GPL",
      placeholder,
      plugins: [
        Alignment,
        BlockQuote,
        Bold,
        Essentials,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        Heading,
        Image,
        ImageInsert,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        List,
        MediaEmbed,
        Paragraph,
        SourceEditing,
        Strikethrough,
        Subscript,
        Superscript,
        Table,
        TableToolbar,
        Underline,
        Undo,
        uploadAdapterPlugin,
      ],
      toolbar: {
        items: [
          "undo",
          "redo",
          "|",
          "heading",
          "fontFamily",
          "fontSize",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "subscript",
          "superscript",
          "|",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "alignment",
          "bulletedList",
          "numberedList",
          "outdent",
          "indent",
          "|",
          "blockQuote",
          "link",
          "insertImage",
          "mediaEmbed",
          "insertTable",
          "|",
          "sourceEditing",
        ],
        shouldNotGroupWhenFull: false,
      },
      fontFamily: {
        options: EDITOR_FONT_FAMILIES,
        supportAllValues: true,
      },
      image: {
        toolbar: [
          "imageTextAlternative",
          "|",
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
          "|",
          "resizeImage",
        ],
        upload: {
          types: ["jpeg", "png", "gif", "webp", "bmp"],
        },
      },
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
      },
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
      },
    }),
    [placeholder, uploadAdapterPlugin]
  );

  return (
    <div
      className="admin-rich-editor"
      style={
        {
          "--admin-editor-height": editorHeight,
          "--admin-editor-min-height": minHeight,
          "--admin-editor-max-height": maxHeight || "none",
        } as React.CSSProperties
      }
    >
      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        config={editorConfig}
        onReady={(editor) => {
          editor.editing.view.change((writer) => {
            writer.setAttribute("spellcheck", "true", editor.editing.view.document.getRoot()!);
          });

          const editableElement = editor.ui.view.editable.element;
          const editorMainElement = editableElement?.closest(".ck-editor__main") as HTMLElement | null;

          watchEditorResize(editorMainElement);
          void migrateInlineImagesToStorage(editor);
        }}
        onChange={(_, editor) => {
          const content = editor.getData();
          valueRef.current = content;
          onChange(content);
        }}
        onError={(error) => {
          console.error(error);
          toast.error("Editor gagal dimuat. Silakan muat ulang halaman.");
        }}
      />
    </div>
  );
}
