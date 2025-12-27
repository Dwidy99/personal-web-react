import { forwardRef } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

type Props = {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
};

const SunEditorField = forwardRef<typeof SunEditor, Props>(
  ({ value, onChange, placeholder = "Write something...", height = "280px" }, _ref) => {
    return (
      <div className="w-full">
        <SunEditor
          // ref tidak terlalu dibutuhkan untuk basic usage
          setContents={value}
          onChange={onChange}
          setOptions={{
            height,
            placeholder,
            buttonList: [
              // default
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
              // responsive
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
