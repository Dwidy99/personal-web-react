import { Suspense, lazy, useEffect, useState } from "react";
import "@/lib/hljs";
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
  const [hljsReady, setHljsReady] = useState(false);

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

  if (!hljsReady) return <div className="text-sm text-gray-500">Loading content...</div>;

  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <ReactQuill
        value={content}
        readOnly
        modules={{ toolbar: false, syntax: true }} // ✅ safe now
        theme="bubble"
        className={`quill-viewer ${className}`}
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
