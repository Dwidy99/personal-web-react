// src/components/ReactQuillEditor.tsx
import React, { forwardRef } from "react";
import ReactQuill from "react-quill";
import PropTypes from "prop-types";
import "react-quill/dist/quill.snow.css";

// ✅ Definisikan tipe props
interface ReactQuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// ✅ forwardRef ke instance ReactQuill (bukan HTMLDivElement)
const ReactQuillEditor = forwardRef<ReactQuill, ReactQuillEditorProps>(
  ({ value, onChange, placeholder = "Enter text..." }, ref) => {
    const modules = {
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
    };

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

    // ✅ ref diarahkan langsung ke ReactQuill instance
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

// ✅ Tambahkan nama komponen
ReactQuillEditor.displayName = "ReactQuillEditor";

// ✅ Tambahkan prop-types untuk runtime check
ReactQuillEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default ReactQuillEditor;
