import { forwardRef, type ComponentProps } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Api from "@/services/Api";

type Props = {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
};

type SunEditorOnImageUploadBefore = NonNullable<
  ComponentProps<typeof SunEditor>["onImageUploadBefore"]
>;

const SunEditorField = forwardRef<typeof SunEditor, Props>(
  ({ value, onChange, placeholder = "Write something...", height = "280px" }, _ref) => {
    const handleImageUploadBefore: SunEditorOnImageUploadBefore = (files, info, uploadHandler) => {
      const file = files?.[0];

      if (!file) {
        return false;
      }

      const formData = new FormData();
      formData.append("image", file);

      Api.post<{ url: string }>("/api/admin/projects/editor-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          const imageUrl = res.data?.url;

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
          console.error("Editor image upload failed:", error, info);
          alert("Upload gambar gagal");
        });

      return undefined;
    };

    return (
      <div className="w-full">
        <SunEditor
          setContents={value}
          onChange={onChange}
          onImageUploadBefore={handleImageUploadBefore}
          setOptions={{
            height,
            placeholder,
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
