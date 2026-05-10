import DOMPurify from "dompurify";
import { normalizeEditorImageSources } from "@/utils/editorImages";

type Props = {
  content?: string;
  className?: string;
};

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
      line-height: 1.75;
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
      margin: 1.4em 0 0.55em;
      font-weight: 800;
    }

    .ckeditor-renderer p,
    .ckeditor-renderer ul,
    .ckeditor-renderer ol,
    .ckeditor-renderer blockquote,
    .ckeditor-renderer figure,
    .ckeditor-renderer table,
    .ckeditor-renderer pre {
      margin-top: 1em;
      margin-bottom: 1em;
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

  const normalizedContent = normalizeEditorImageSources(content);
  const sanitized = DOMPurify.sanitize(normalizedContent, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["figure", "figcaption"],
    ADD_ATTR: ["target", "rel", "class", "style", "width", "height"],
  });

  return (
    <div
      className={`ckeditor-renderer ck-content prose dark:prose-invert max-w-none break-words ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
