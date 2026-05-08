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
};

type SunEditorOnImageUploadBefore = NonNullable<
  ComponentProps<typeof SunEditor>["onImageUploadBefore"]
>;

type SunEditorOnImageUploadError = NonNullable<
  ComponentProps<typeof SunEditor>["onImageUploadError"]
>;

const MAX_INLINE_IMAGE_SIZE = 500 * 1024;
const MAX_INLINE_IMAGE_SIZE_LABEL = "500KB";

const SunEditorField = forwardRef<typeof SunEditor, Props>(
  (
    {
      value,
      onChange,
      placeholder = "Write something...",
      height = "280px",
      minHeight = "220px",
      maxHeight,
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

      const invalidFile = fileList.find((file) => file.size > MAX_INLINE_IMAGE_SIZE);

      if (invalidFile) {
        toast.error(`Ukuran gambar maksimal ${MAX_INLINE_IMAGE_SIZE_LABEL}.`);
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
