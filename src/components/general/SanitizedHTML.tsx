import DOMPurify from "dompurify";

type Props = {
  content?: string;
  className?: string;
};

export default function ContentRenderer({ content = "", className = "" }: Props) {
  const sanitizedHtml = DOMPurify.sanitize(content, {
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
}
