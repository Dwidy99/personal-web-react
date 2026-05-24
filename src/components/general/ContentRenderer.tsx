import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { normalizeEditorImageSources } from "@/utils/editorImages";

type Props = {
  content?: string;
  className?: string;
};

type ImagePreview = {
  src: string;
  alt: string;
};

function isThemeSensitiveTextColor(color: string) {
  const normalized = color.trim().toLowerCase().replace(/\s+/g, "");

  if (!normalized) {
    return false;
  }

  return [
    "black",
    "#000",
    "#000000",
    "rgb(0,0,0)",
    "rgba(0,0,0,1)",
    "hsl(0,0%,0%)",
    "hsla(0,0%,0%,1)",
    "white",
    "#fff",
    "#ffffff",
    "rgb(255,255,255)",
    "rgba(255,255,255,1)",
    "hsl(0,0%,100%)",
    "hsla(0,0%,100%,1)",
  ].includes(normalized);
}

function normalizeThemeSensitiveEditorColors(html: string) {
  if (!html || typeof DOMParser === "undefined") {
    return html;
  }

  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.body.querySelectorAll<HTMLElement>("[style]").forEach((element) => {
    const color = element.style.color;

    if (color && isThemeSensitiveTextColor(color)) {
      element.style.removeProperty("color");
    }

    if (!element.getAttribute("style")?.trim()) {
      element.removeAttribute("style");
    }
  });

  return doc.body.innerHTML;
}

function injectContentRendererStyles() {
  if (typeof document === "undefined") {
    return;
  }

  const styleId = "ckeditor-content-renderer-styles";

  if (document.getElementById(styleId)) {
    return;
  }

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .ckeditor-renderer {
      color: #334155;
      font-family: "Satoshi", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.68;
    }

    .dark .ckeditor-renderer {
      color: #e2e8f0;
    }

    .ckeditor-renderer h1,
    .ckeditor-renderer h2,
    .ckeditor-renderer h3,
    .ckeditor-renderer h4,
    .ckeditor-renderer h5,
    .ckeditor-renderer h6 {
      color: #0f172a;
    }

    .dark .ckeditor-renderer h1,
    .dark .ckeditor-renderer h2,
    .dark .ckeditor-renderer h3,
    .dark .ckeditor-renderer h4,
    .dark .ckeditor-renderer h5,
    .dark .ckeditor-renderer h6 {
      color: #ffffff;
    }

    .ckeditor-renderer > :first-child {
      margin-top: 0;
    }

    .ckeditor-renderer > :last-child {
      margin-bottom: 0;
    }

    .ckeditor-renderer h1,
    .ckeditor-renderer h2,
    .ckeditor-renderer h3,
    .ckeditor-renderer h4,
    .ckeditor-renderer h5,
    .ckeditor-renderer h6 {
      line-height: 1.18;
      margin: 0.85em 0 0.35em;
      font-weight: 800;
    }

    .ckeditor-renderer h1 {
      font-size: 2rem;
    }

    .ckeditor-renderer h2 {
      font-size: 1.6rem;
    }

    .ckeditor-renderer h3 {
      font-size: 1.35rem;
    }

    .ckeditor-renderer h4,
    .ckeditor-renderer h5,
    .ckeditor-renderer h6 {
      font-size: 1.1rem;
    }

    .ckeditor-renderer p,
    .ckeditor-renderer blockquote,
    .ckeditor-renderer figure,
    .ckeditor-renderer table,
    .ckeditor-renderer pre {
      margin-top: 0.55em;
      margin-bottom: 0.55em;
    }

    .ckeditor-renderer ul,
    .ckeditor-renderer ol {
      margin-top: 0.35em;
      margin-bottom: 0.65em;
    }

    .ckeditor-renderer ul,
    .ckeditor-renderer ol {
      padding-left: 1.5rem;
    }

    .ckeditor-renderer ul {
      list-style: disc;
    }

    .ckeditor-renderer ol {
      list-style: decimal;
    }

    .ckeditor-renderer li {
      margin-top: 0.18em;
      margin-bottom: 0.18em;
      padding-left: 0.2rem;
    }

    .ckeditor-renderer li > p {
      margin-top: 0.15em;
      margin-bottom: 0.15em;
    }

    .ckeditor-renderer blockquote {
      border-left: 4px solid #38bdf8;
      padding-left: 1rem;
      color: #475569;
      font-style: italic;
    }

    .dark .ckeditor-renderer blockquote {
      color: #cbd5e1;
      border-left-color: #7dd3fc;
    }

    .ckeditor-renderer a {
      color: #0284c7;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    .dark .ckeditor-renderer a {
      color: #7dd3fc;
    }

    .ckeditor-renderer figure.image {
      clear: both;
      display: table;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }

    .ckeditor-renderer figure.image img,
    .ckeditor-renderer img {
      display: block;
      height: auto;
      max-width: 100%;
      cursor: zoom-in;
      transition: opacity 180ms ease, transform 180ms ease;
    }

    .ckeditor-renderer figure.image img:hover,
    .ckeditor-renderer img:hover {
      opacity: 0.92;
    }

    .ckeditor-renderer figure.image img {
      margin-left: auto;
      margin-right: auto;
    }

    .ckeditor-renderer figure.image_resized,
    .ckeditor-renderer figure.image.image_resized {
      box-sizing: border-box;
      display: block;
      max-width: 100%;
    }

    .ckeditor-renderer figure.image_resized img,
    .ckeditor-renderer figure.image.image_resized img {
      width: 100%;
    }

    .ckeditor-renderer .image-style-side {
      float: right;
      max-width: 50%;
      margin-left: 1.5rem;
    }

    .ckeditor-renderer .image-style-align-left {
      float: left;
      margin-right: 1.5rem;
    }

    .ckeditor-renderer .image-style-align-center {
      margin-left: auto;
      margin-right: auto;
    }

    .ckeditor-renderer .image-style-align-right {
      margin-left: auto;
      margin-right: 0;
    }

    .ckeditor-renderer figcaption {
      margin-top: 0.5rem;
      color: #64748b;
      font-size: 0.875rem;
      text-align: center;
    }

    .dark .ckeditor-renderer figcaption {
      color: #94a3b8;
    }

    .ckeditor-renderer figure.table {
      overflow-x: auto;
      width: 100%;
    }

    .ckeditor-renderer table {
      border-collapse: collapse;
      width: 100%;
    }

    .ckeditor-renderer th,
    .ckeditor-renderer td {
      border: 1px solid #cbd5e1;
      padding: 0.65rem 0.8rem;
      vertical-align: top;
    }

    .ckeditor-renderer th {
      background: #f8fafc;
      font-weight: 700;
    }

    .dark .ckeditor-renderer th,
    .dark .ckeditor-renderer td {
      border-color: #475569;
    }

    .dark .ckeditor-renderer th {
      background: rgba(255, 255, 255, 0.06);
    }

    .ckeditor-renderer pre {
      max-width: 100%;
      overflow-x: auto;
      border-radius: 0.75rem;
      padding: 1rem;
    }

    .ckeditor-renderer iframe {
      max-width: 100%;
    }

    .ckeditor-renderer::after {
      clear: both;
      content: "";
      display: block;
    }
  `;
  document.head.appendChild(style);
}

export default function ContentRenderer({ content = "", className = "" }: Props) {
  injectContentRendererStyles();
  const [preview, setPreview] = useState<ImagePreview | null>(null);

  const sanitized = useMemo(() => {
    const normalizedContent = normalizeEditorImageSources(content);
    const colorSafeContent = normalizeThemeSensitiveEditorColors(normalizedContent);

    return DOMPurify.sanitize(colorSafeContent, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ["figure", "figcaption"],
      ADD_ATTR: ["target", "rel", "class", "style", "width", "height"],
    });
  }, [content]);

  useEffect(() => {
    if (!preview) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreview(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [preview]);

  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    const image = target?.closest("img") as HTMLImageElement | null;

    if (!image || !event.currentTarget.contains(image)) {
      return;
    }

    setPreview({
      src: image.currentSrc || image.src,
      alt: image.alt || "Content image preview",
    });
  };

  return (
    <>
      <div
        className={`ckeditor-renderer ck-content not-prose max-w-none break-words ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitized }}
        onClick={handleContentClick}
      />

      {preview && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl font-semibold text-slate-900 shadow-lg transition hover:bg-white"
            aria-label="Close image preview"
            onClick={() => setPreview(null)}
          >
            &times;
          </button>

          <img
            src={preview.src}
            alt={preview.alt}
            className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
