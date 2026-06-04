import DOMPurify from "dompurify";

export function toPlainText(value?: string | null): string {
  return DOMPurify.sanitize(value || "", {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
    .replace(/\s+/g, " ")
    .trim();
}

export function createExcerpt(value?: string | null, maxLength = 145): string {
  const text = toPlainText(value);

  if (!text) {
    return "";
  }

  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}
