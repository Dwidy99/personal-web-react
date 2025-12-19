import "@/lib/hljs";
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
    ADD_ATTR: ["class", "data-language"],
    ADD_TAGS: ["pre", "code"],
  });

  return (
    <div
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

// ===== QuillViewer Component =====
const QuillViewer = ({ content, className = "" }: { content: string; className?: string }) => {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">Loading content...</div>}>
      <ReactQuill
        value={content}
        readOnly
        theme="bubble"
        className={`quill-viewer ${className}`}
        modules={{
          toolbar: false,
          syntax: true, // ✅ IMPORTANT: turn ON to colorize code blocks
        }}
      />
    </Suspense>
  );
};

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
