// src/components/general/ReactQuillEditor.tsx
import { forwardRef, useMemo, Suspense, lazy } from "react";
import type ReactQuillType from "react-quill";
// import { ensureHLJS } from "@/lib/hljs";

import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/github-dark.css";

type Props = {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
};

// ✅ IMPORTANT: ensureHLJS runs BEFORE react-quill module is evaluated
const ReactQuill = lazy(async () => {
  // ensureHLJS();
  const mod = await import("react-quill");
  return { default: mod.default };
});

const ReactQuillEditor = forwardRef<ReactQuillType, Props>(
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
      <Suspense
        fallback={
          <div className="w-full rounded-lg border border-stroke p-3 text-sm text-gray-500">
            Loading editor...
          </div>
        }
      >
        <ReactQuill
          ref={ref as any}
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
