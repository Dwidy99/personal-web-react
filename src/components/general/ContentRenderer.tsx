import DOMPurify from "dompurify";

type Props = {
  content?: string;
  className?: string;
};

export default function ContentRenderer({ content = "", className = "" }: Props) {
  const sanitized = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel", "class"],
  });

  return (
    <div
      className={`prose dark:prose-invert max-w-none break-words ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
