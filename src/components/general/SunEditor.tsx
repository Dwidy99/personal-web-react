import { forwardRef, useEffect, type ComponentProps } from "react";
import SunEditor from "suneditor-react";
import toast from "react-hot-toast";

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

type SunEditorOnImageUploadBefore = NonNullable<
  ComponentProps<typeof SunEditor>["onImageUploadBefore"]
>;

type SunEditorOnImageUploadError = NonNullable<
  ComponentProps<typeof SunEditor>["onImageUploadError"]
>;

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

const SunEditorField = forwardRef<typeof SunEditor, Props>(
  (
    {
      value,
      onChange,
      placeholder = "Write something...",
      height = "280px",
      minHeight = "220px",
      maxHeight,
      maxImageCount = DEFAULT_MAX_INLINE_IMAGE_COUNT,
      maxInlineImagesTotalSize = DEFAULT_MAX_INLINE_IMAGES_TOTAL_SIZE,
    },
    ref
  ) => {
    useEffect(() => {
      const styleId = "suneditor-runtime-styles";
      const resizeStyleId = "suneditor-resize-styles";

      if (!document.getElementById(resizeStyleId)) {
        const resizeStyle = document.createElement("style");
        resizeStyle.id = resizeStyleId;
        resizeStyle.textContent = `
          .sun-editor-resize-frame {
            resize: vertical;
            overflow: auto;
            width: 100%;
          }

          .sun-editor-resize-frame > .sun-editor {
            height: 100% !important;
            min-height: 100% !important;
          }

          .sun-editor-resize-frame .se-container {
            display: flex !important;
            min-height: 100% !important;
            flex-direction: column !important;
          }

          .sun-editor-resize-frame .se-wrapper {
            flex: 1 1 auto !important;
            min-height: 120px !important;
          }

          .sun-editor-resize-frame .se-wrapper-inner {
            min-height: 100% !important;
          }
        `;
        document.head.appendChild(resizeStyle);
      }

      if (document.getElementById(styleId)) return;

      import("suneditor/dist/css/suneditor.min.css?inline").then((module) => {
        if (document.getElementById(styleId)) {
          return;
        }

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = module.default;
        document.head.appendChild(style);
      });
    }, []);

    const handleImageUploadBefore: SunEditorOnImageUploadBefore = (files) => {
      const fileList = Array.from(files || []);

      if (fileList.length === 0) {
        return false;
      }

      const nonImageFile = fileList.find((file) => !file.type.startsWith("image/"));

      if (nonImageFile) {
        toast.error("File harus berupa gambar.");
        return false;
      }

      const invalidFile = fileList.find((file) => file.size > MAX_INLINE_IMAGE_SIZE);

      if (invalidFile) {
        toast.error(
          `Ukuran tiap gambar maksimal ${MAX_INLINE_IMAGE_SIZE_LABEL}. ${invalidFile.name} berukuran ${formatBytes(invalidFile.size)}.`
        );
        return false;
      }

      const existingImages = getEditorImages(value);
      const nextImageCount = existingImages.length + fileList.length;

      if (nextImageCount > maxImageCount) {
        toast.error(`Maksimal ${maxImageCount} gambar dalam satu editor.`);
        return false;
      }

      const existingInlineSize = existingImages.reduce(
        (total, image) => total + estimateBase64ImageSize(image.getAttribute("src") || ""),
        0
      );
      const nextInlineSize =
        existingInlineSize + fileList.reduce((total, file) => total + file.size, 0);

      if (nextInlineSize > maxInlineImagesTotalSize) {
        toast.error(
          `Total gambar inline maksimal ${formatBytes(maxInlineImagesTotalSize)}. Saat ini akan menjadi ${formatBytes(nextInlineSize)}.`
        );
        return false;
      }

      return true;
    };

    const handleImageUploadError: SunEditorOnImageUploadError = (message) => {
      toast.error(
        message || `Upload gambar gagal. Ukuran gambar maksimal ${MAX_INLINE_IMAGE_SIZE_LABEL}.`
      );
      return false;
    };

    return (
      <div className="sun-editor-resize-frame" style={{ height, minHeight, maxHeight }}>
        <SunEditor
          ref={ref}
          setContents={value}
          onChange={onChange}
          onImageUploadBefore={handleImageUploadBefore}
          onImageUploadError={handleImageUploadError}
          setOptions={{
            height,
            minHeight,
            maxHeight,
            placeholder,
            resizingBar: true,
            resizeEnable: true,
            showPathLabel: false,
            imageMultipleFile: true,
            imageUploadSizeLimit: MAX_INLINE_IMAGE_SIZE,
            buttonList: [
              ["undo", "redo"],
              ["font", "fontSize", "formatBlock"],
              ["paragraphStyle", "blockquote"],
              ["bold", "underline", "italic", "strike", "subscript", "superscript"],
              ["fontColor", "hiliteColor", "textStyle"],
              ["removeFormat"],
              ["outdent", "indent"],
              ["align", "horizontalRule", "list", "lineHeight"],
              ["table", "link", "image", "video"],
              ["fullScreen", "showBlocks", "codeView"],
              ["preview"],
              ["save"],
              [
                "%1161",
                [
                  ["undo", "redo"],
                  [
                    ":p-Formats-default.more_paragraph",
                    "font",
                    "fontSize",
                    "formatBlock",
                    "paragraphStyle",
                    "blockquote",
                  ],
                  ["bold", "underline", "italic", "strike", "subscript", "superscript"],
                  ["fontColor", "hiliteColor", "textStyle"],
                  ["removeFormat"],
                  ["outdent", "indent"],
                  ["align", "horizontalRule", "list", "lineHeight"],
                  ["-right", "save"],
                  [
                    "-right",
                    ":i-Etc-default.more_vertical",
                    "fullScreen",
                    "showBlocks",
                    "codeView",
                    "preview",
                  ],
                  ["-right", ":r-Table&Media-default.more_plus", "table", "link", "image", "video"],
                ],
              ],
              [
                "%893",
                [
                  ["undo", "redo"],
                  [
                    ":p-Formats-default.more_paragraph",
                    "font",
                    "fontSize",
                    "formatBlock",
                    "paragraphStyle",
                    "blockquote",
                  ],
                  ["bold", "underline", "italic", "strike"],
                  [
                    ":t-Fonts-default.more_text",
                    "subscript",
                    "superscript",
                    "fontColor",
                    "hiliteColor",
                    "textStyle",
                  ],
                  ["removeFormat"],
                  ["outdent", "indent"],
                  ["align", "horizontalRule", "list", "lineHeight"],
                  ["-right", "save"],
                  [
                    "-right",
                    ":i-Etc-default.more_vertical",
                    "fullScreen",
                    "showBlocks",
                    "codeView",
                    "preview",
                  ],
                  ["-right", ":r-Table&Media-default.more_plus", "table", "link", "image", "video"],
                ],
              ],
              [
                "%855",
                [
                  ["undo", "redo"],
                  [
                    ":p-Formats-default.more_paragraph",
                    "font",
                    "fontSize",
                    "formatBlock",
                    "paragraphStyle",
                    "blockquote",
                  ],
                  [
                    ":t-Fonts-default.more_text",
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                    "fontColor",
                    "hiliteColor",
                    "textStyle",
                  ],
                  ["removeFormat"],
                  ["outdent", "indent"],
                  ["align", "horizontalRule", "list", "lineHeight"],
                  [":r-Table&Media-default.more_plus", "table", "link", "image", "video"],
                  ["-right", "save"],
                  [
                    "-right",
                    ":i-Etc-default.more_vertical",
                    "fullScreen",
                    "showBlocks",
                    "codeView",
                    "preview",
                  ],
                ],
              ],
              [
                "%563",
                [
                  ["undo", "redo"],
                  [
                    ":p-Formats-default.more_paragraph",
                    "font",
                    "fontSize",
                    "formatBlock",
                    "paragraphStyle",
                    "blockquote",
                  ],
                  [
                    ":t-Fonts-default.more_text",
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                    "fontColor",
                    "hiliteColor",
                    "textStyle",
                  ],
                  ["removeFormat"],
                  ["outdent", "indent"],
                  [
                    ":e-List&Line-default.more_horizontal",
                    "align",
                    "horizontalRule",
                    "list",
                    "lineHeight",
                  ],
                  [":r-Table&Media-default.more_plus", "table", "link", "image", "video"],
                  ["-right", "save"],
                  [
                    "-right",
                    ":i-Etc-default.more_vertical",
                    "fullScreen",
                    "showBlocks",
                    "codeView",
                    "preview",
                  ],
                ],
              ],
              [
                "%458",
                [
                  ["undo", "redo"],
                  [
                    ":p-Formats-default.more_paragraph",
                    "font",
                    "fontSize",
                    "formatBlock",
                    "paragraphStyle",
                    "blockquote",
                  ],
                  [
                    ":t-Fonts-default.more_text",
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                    "fontColor",
                    "hiliteColor",
                    "textStyle",
                    "removeFormat",
                  ],
                  [
                    ":e-List&Line-default.more_horizontal",
                    "outdent",
                    "indent",
                    "align",
                    "horizontalRule",
                    "list",
                    "lineHeight",
                  ],
                  [":r-Table&Media-default.more_plus", "table", "link", "image", "video"],
                  ["-right", "save"],
                  [
                    "-right",
                    ":i-Etc-default.more_vertical",
                    "fullScreen",
                    "showBlocks",
                    "codeView",
                    "preview",
                  ],
                ],
              ],
            ],
          }}
        />
      </div>
    );
  }
);

SunEditorField.displayName = "SunEditorField";
export default SunEditorField;
