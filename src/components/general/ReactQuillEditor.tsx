import { forwardRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { setupQuillSyntax } from "@/lib/quillSyntax";

// ✅ extra safety: ensure window.hljs exists even if main.tsx missed it
setupQuillSyntax();

type Props = {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
};

const ReactQuillEditor = forwardRef<ReactQuill, Props>(
  ({ value, onChange, placeholder = "Write something...", className = "" }, ref) => {
    const modules = useMemo(
      () => ({
        toolbar: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
        syntax: true,
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
      <div className={className}>
        <ReactQuill
          ref={ref}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>
    );
  }
);

ReactQuillEditor.displayName = "ReactQuillEditor";
export default ReactQuillEditor;
