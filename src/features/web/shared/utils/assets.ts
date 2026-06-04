const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export function getPublicAssetUrl(path?: string | null): string {
  if (!path) {
    return "";
  }

  if (/^(https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  return `${apiBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function appendRetryParam(url: string, retryCount: number): string {
  if (!retryCount) {
    return url;
  }

  return `${url}${url.includes("?") ? "&" : "?"}retry=${retryCount}`;
}
