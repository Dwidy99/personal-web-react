import { useEffect, useMemo, useRef } from "react";
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
};

type UploadResult = {
  default: string;
};

const MAX_INLINE_IMAGE_SIZE = 500 * 1024;
const MAX_INLINE_IMAGE_SIZE_LABEL = "500KB";
const DEFAULT_MAX_INLINE_IMAGE_COUNT = 8;
const DEFAULT_MAX_INLINE_IMAGES_TOTAL_SIZE = 4 * 1024 * 1024;

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

    .admin-rich-editor .ck.ck-editor__main > .ck-editor__editable {
      min-height: var(--admin-editor-min-height);
      height: var(--admin-editor-height);
      max-height: var(--admin-editor-max-height);
      resize: vertical;
      overflow: auto;
      border-color: #d9e0ec;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-shadow: none;
    }

    .admin-rich-editor .ck.ck-editor__editable_inline {
      padding: 18px 22px;
      color: #111827;
      font-size: 15px;
      line-height: 1.7;
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
}: Props) {
  const valueRef = useRef(value);
  const pendingUploadRef = useRef({ count: 0, size: 0 });
  const limitsRef = useRef({ maxImageCount, maxInlineImagesTotalSize });

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    limitsRef.current = { maxImageCount, maxInlineImagesTotalSize };
  }, [maxImageCount, maxInlineImagesTotalSize]);

  useEffect(() => {
    injectEditorStyles();
  }, []);

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

            if (file.size > MAX_INLINE_IMAGE_SIZE) {
              toast.error(
                `Ukuran tiap gambar maksimal ${MAX_INLINE_IMAGE_SIZE_LABEL}. ${file.name} berukuran ${formatBytes(file.size)}.`
              );
              throw new Error("Ukuran gambar terlalu besar.");
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

            try {
              const dataUrl = await readFileAsDataUrl(file);

              return { default: dataUrl };
            } finally {
              pendingUploadRef.current = {
                count: Math.max(0, pendingUploadRef.current.count - 1),
                size: Math.max(0, pendingUploadRef.current.size - file.size),
              };
            }
          },
          abort() {
            return undefined;
          },
        });
      },
    []
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
          "--admin-editor-height": height,
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
