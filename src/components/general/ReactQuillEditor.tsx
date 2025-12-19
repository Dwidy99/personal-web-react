import { forwardRef, useEffect, useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import Quill from "quill";

// ✅ ONE highlight.js theme
import "highlight.js/styles/github-dark.css";

import Syntax from "quill/modules/syntax";
Quill.register("modules/syntax", Syntax, true);

interface ReactQuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const ReactQuillEditor = forwardRef<ReactQuill, ReactQuillEditorProps>(
  ({ value, onChange, placeholder = "Enter text..." }, ref) => {
    const [hljsReady, setHljsReady] = useState(false);

    // ✅ Ensure hljs exists BEFORE Quill mounts
    useEffect(() => {
      let mounted = true;

      const init = async () => {
        if (!(window as any).hljs) {
          const mod = await import("highlight.js");
          (window as any).hljs = mod.default;
        }

        if (mounted) setHljsReady(true);
      };

      init();

      return () => {
        mounted = false;
      };
    }, []);

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
        syntax: true, // ✅ safe now
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

    // ✅ Don't mount ReactQuill until hljs exists
    if (!hljsReady) {
      return <div className="text-sm text-gray-500 dark:text-gray-400">Loading editor...</div>;
    }

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
