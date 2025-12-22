import hljs from "highlight.js";
import { useEffect, useRef } from "react";

export default function ContentRenderer({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const blocks = ref.current.querySelectorAll("pre code, pre.ql-syntax");

    blocks.forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [content]);

  return (
    <div
      ref={ref}
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
