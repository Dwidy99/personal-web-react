const EDITOR_IMAGE_FILE_PATTERN = /^[^/?#]+\.(?:png|jpe?g|gif|webp|bmp)(?:[?#].*)?$/i;

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
}

export function normalizeEditorImageUrl(src: string) {
  const value = src.trim();

  if (!value || /^(data:|blob:|https?:\/\/|\/\/|mailto:|tel:)/i.test(value)) {
    return value;
  }

  const apiBaseUrl = getApiBaseUrl();

  if (value.startsWith("/storage/")) {
    return `${apiBaseUrl}${value}`;
  }

  if (value.startsWith("storage/")) {
    return `${apiBaseUrl}/${value}`;
  }

  if (value.startsWith("/projects/editor/")) {
    return `${apiBaseUrl}/storage${value}`;
  }

  if (value.startsWith("projects/editor/")) {
    return `${apiBaseUrl}/storage/${value}`;
  }

  if (EDITOR_IMAGE_FILE_PATTERN.test(value)) {
    return `${apiBaseUrl}/storage/projects/editor/${value}`;
  }

  return value;
}

export function normalizeEditorImageSources(content: string) {
  if (!content || typeof DOMParser === "undefined") {
    return content;
  }

  const doc = new DOMParser().parseFromString(content, "text/html");
  let changed = false;

  doc.querySelectorAll("img").forEach((image) => {
    const src = image.getAttribute("src");

    if (!src) {
      return;
    }

    const normalizedSrc = normalizeEditorImageUrl(src);

    if (normalizedSrc !== src) {
      image.setAttribute("src", normalizedSrc);
      changed = true;
    }
  });

  return changed ? doc.body.innerHTML : content;
}
