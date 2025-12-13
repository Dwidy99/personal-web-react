// src/components/ReactQuillEditor.tsx
import React, { forwardRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// ✅ highlight.js (syntax highlighting)
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // 🔥 this makes it look like the demo

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

        // ✅ THIS is the key: syntax module
        syntax: {
          highlight: (text: string) => hljs.highlightAuto(text).value,
        },
      }),
      []
    );

    const formats = [
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
    ];

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
