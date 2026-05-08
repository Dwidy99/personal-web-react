import { forwardRef, useEffect, type ComponentProps } from "react";
import SunEditor from "suneditor-react";
import Api from "@/services/Api";
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

type EditorUploadResponse = {
  url?: string;
  path?: string;
  image?: string;
  data?: {
    url?: string;
    path?: string;
    image?: string;
  };
};

function normalizeImageUrl(url: string) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const baseUrl = Api.defaults.baseURL?.replace(/\/$/, "") || window.location.origin;
  const cleanPath = url.startsWith("/") ? url : `/${url}`;

  return `${baseUrl}${cleanPath}`;
}

function getUploadedImageUrl(response: EditorUploadResponse) {
  const url =
    response.url ||
    response.path ||
    response.image ||
    response.data?.url ||
    response.data?.path ||
    response.data?.image;

  return url ? normalizeImageUrl(url) : "";
}

const SunEditorField = forwardRef<typeof SunEditor, Props>(
  (
    {
      value,
      onChange,
      placeholder = "Write something...",
      height = "280px",
      minHeight = "220px",
      maxHeight = "720px",
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

    const handleImageUploadBefore: SunEditorOnImageUploadBefore = (
      files,
      info,
      _core,
      uploadHandler
    ) => {
      const file = files?.[0];

      if (!file) {
        return false;
      }

      const formData = new FormData();
      formData.append("image", file);

      Api.post<EditorUploadResponse>("/api/admin/projects/editor-upload", formData)
        .then((res) => {
          const imageUrl = getUploadedImageUrl(res.data);

          if (!imageUrl) {
            throw new Error("Image URL not returned from server");
          }

          uploadHandler({
            result: [
              {
                url: imageUrl,
                name: file.name,
                size: file.size,
              },
            ],
          });
        })
        .catch((error) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Upload gambar gagal. Periksa format dan ukuran gambar.";

          console.error("Editor image upload failed:", {
            error,
            info,
            response: error?.response?.data,
          });
          toast.error(message);
          uploadHandler(message);
        });

      return undefined;
    };

    return (
      <div className="sun-editor-resize-frame" style={{ height, minHeight, maxHeight }}>
        <SunEditor
          ref={ref}
          setContents={value}
          onChange={onChange}
          onImageUploadBefore={handleImageUploadBefore}
          setOptions={{
            height,
            minHeight,
            maxHeight,
            placeholder,
            resizingBar: true,
            resizeEnable: true,
            showPathLabel: false,
            imageUploadSizeLimit: 1024 * 1024 * 5,
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
