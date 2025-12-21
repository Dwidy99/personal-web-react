import { forwardRef, useMemo, Suspense, lazy } from "react";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/github-dark.css";

// ✅ IMPORTANT: ensure hljs attaches BEFORE react-quill loads (especially in prod)
const ReactQuill = lazy(async () => {
  await import("@/lib/hljs");
  return import("react-quill");
});

type Props = {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
};

const ReactQuillEditor = forwardRef<any, Props>(
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
        syntax: true, // ✅ now guaranteed safe
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
      <Suspense fallback={<div className="text-sm text-gray-500">Loading editor...</div>}>
        <ReactQuill
          ref={ref}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </Suspense>
    );
  }
);

ReactQuillEditor.displayName = "ReactQuillEditor";
export default ReactQuillEditor;
