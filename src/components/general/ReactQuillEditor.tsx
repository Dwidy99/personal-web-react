// src/components/general/ReactQuillEditor.tsx
import "@/lib/hljs"; // ✅ ensure window.hljs exists BEFORE Quill loads

import { forwardRef, useMemo } from "react";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/github-dark.css";

type Props = {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
};

const ReactQuillEditor = forwardRef<ReactQuill, Props>(
  ({ value, onChange, placeholder = "Write something..." }, ref) => {
    const modules = useMemo(
      () => ({
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
        syntax: true, // ✅ now safe
      }),
      []
    );

    const formats = useMemo(
      () => [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "blockquote",
        "code-block",
        "link",
        "image",
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
