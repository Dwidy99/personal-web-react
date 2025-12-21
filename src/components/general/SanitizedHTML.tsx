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
    const root = ref.current;
    if (!root) return;

    // target: quill code blocks + normal code blocks
    const blocks = root.querySelectorAll("pre.ql-syntax, pre code");

    blocks.forEach((el) => {
      // if it's <pre>, try to highlight <code> inside it; else highlight itself
      const target =
        el.tagName.toLowerCase() === "pre"
          ? ((el.querySelector("code") as HTMLElement) ?? (el as HTMLElement))
          : (el as HTMLElement);

      target.removeAttribute("data-highlighted");
      target.classList.remove("hljs");

      const raw = target.textContent ?? "";
      target.textContent = raw;

      hljs.highlightElement(target);
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
