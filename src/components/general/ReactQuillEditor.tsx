import "@/lib/hljs"; // ✅ MUST be first (before react-quill / quill)

import { forwardRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import Quill from "quill";
import Syntax from "quill/modules/syntax";
Quill.register("modules/syntax", Syntax, true);

// ✅ ONE highlight.js theme (keep)
import "highlight.js/styles/github-dark.css";

interface ReactQuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const ReactQuillEditor = forwardRef<ReactQuill, ReactQuillEditorProps>(
  ({ value, onChange, placeholder = "Enter text..." }, ref) => {
    const modules = useMemo(
      () => ({
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        syntax: true, // ✅ highlight enabled
      }),
      []
    );

    const formats = useMemo(
      () => [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "code-block",
        "color",
        "background",
        "script",
        "list",
        "bullet",
        "indent",
        "align",
        "link",
        "image",
        "video",
      ],
      []
    );

    return (
      <ReactQuill
        ref={ref}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    );
  }
);

ReactQuillEditor.displayName = "ReactQuillEditor";
export default ReactQuillEditor;
