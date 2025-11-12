import { Suspense, lazy } from "react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import LoadingTailwind from "./LoadingTailwind";

// Lazy load ReactQuill
const ReactQuill = lazy(() => import("react-quill"));

// SanitizedHTML Component
const SanitizedHTML = ({ html, className }) => {
  const sanitizedHtml = DOMPurify.sanitize(html || "", {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "ol",
      "ul",
      "li",
      "a",
      "img",
      "blockquote",
      "pre",
      "code",
      "span",
      "div",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    ALLOWED_ATTR: [
      "href",
      "src",
      "alt",
      "title",
      "class",
      "style",
      "color",
      "width",
      "height",
      "border",
      "cellpadding",
      "cellspacing",
    ],
  });

  return (
    <div
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

// QuillViewer Component
const QuillViewer = ({ content, className }) => (
  <Suspense fallback={<LoadingTailwind />}>
    <ReactQuill
      value={content}
      readOnly={true}
      modules={{ toolbar: false }}
      formats={[
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "indent",
        "image",
        "code-block",
        "color",
      ]}
      theme="bubble"
      className={`quill-viewer ${className}`}
    />
  </Suspense>
);

// Main ContentRenderer Component
const ContentRenderer = ({ content, className, isQuillContent = false }) => {
  const isQuill = isQuillContent || content?.includes("ql-editor");

  return isQuill ? (
    <QuillViewer content={content} className={className} />
  ) : (
    <SanitizedHTML html={content} className={className} />
  );
};

ContentRenderer.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
  isQuillContent: PropTypes.bool,
};

export default ContentRenderer;
