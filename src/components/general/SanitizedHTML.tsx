import { useEffect, useMemo, useRef } from "react";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

// If your Quill output uses ql-* classes, importing bubble CSS helps display nicely:
import "react-quill/dist/quill.bubble.css";

type Props = {
  content?: string;
  className?: string;
};

export default function ContentRenderer({ content = "", className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const safeHtml = useMemo(() => {
    return DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ["class", "data-language"],
      ADD_TAGS: ["pre", "code"],
    });
  }, [content]);

  useEffect(() => {
    if (!ref.current) return;

    const blocks = ref.current.querySelectorAll("pre.ql-syntax, pre code");
    blocks.forEach((el) => {
      const node = el as HTMLElement;

      // allow re-run
      if ((node as any).dataset?.highlighted) {
        delete (node as any).dataset.highlighted;
      }

      hljs.highlightElement(node);
    });
  }, [safeHtml]);

  return (
    <div
      ref={ref}
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
