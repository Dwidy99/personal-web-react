// src/components/ReactQuillEditor.tsx
import { forwardRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// ✅ Highlight.js
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // ✅ pick ONE theme only

// Quill's syntax module uses window.hljs
if (typeof window !== "undefined") {
  (window as any).hljs = hljs;
}

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

        // ✅ Enable syntax highlight
        syntax: true,
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
