// src/components/ReactQuillEditor.tsx
import { forwardRef } from "react";
import ReactQuill from "react-quill";
import PropTypes from "prop-types";
import "react-quill/dist/quill.snow.css";

// Tambahkan fontSize dan color ke Quill jika diperlukan
const ReactQuillEditor = forwardRef(
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

// 💡 Tambahkan displayName untuk menghilangkan warning
ReactQuillEditor.displayName = "ReactQuillEditor";

// 💡 Tambahkan prop-types supaya ESLint happy
ReactQuillEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default ReactQuillEditor;
