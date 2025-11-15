import { Suspense, lazy } from "react";
import DOMPurify from "dompurify";

// Lazy load ReactQuill
const ReactQuill = lazy(() => import("react-quill"));

// ===== Types =====
interface SanitizedHTMLProps {
  html?: string;
  className?: string;
}

interface QuillViewerProps {
  content: string;
  className?: string;
}

interface ContentRendererProps {
  content?: string;
  className?: string;
  isQuillContent?: boolean;
}

// ===== SanitizedHTML Component =====
const SanitizedHTML = ({ html = "", className = "" }: SanitizedHTMLProps): JSX.Element => {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });

  return (
    <div
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

// ===== QuillViewer Component =====
const QuillViewer = ({ content, className = "" }: QuillViewerProps): JSX.Element => (
  <Suspense fallback={<div>Loading editor...</div>}>
    <ReactQuill
      value={content}
      readOnly
      modules={{ toolbar: false }}
      theme="bubble"
      className={`quill-viewer ${className}`}
    />
  </Suspense>
);

// ===== Main ContentRenderer Component =====
const ContentRenderer = ({
  content = "",
  className = "",
  isQuillContent = false,
}: ContentRendererProps): JSX.Element => {
  const isQuill = isQuillContent || content.includes("ql-editor");

  return isQuill ? (
    <QuillViewer content={content} className={className} />
  ) : (
    <SanitizedHTML html={content} className={className} />
  );
};

export default ContentRenderer;
