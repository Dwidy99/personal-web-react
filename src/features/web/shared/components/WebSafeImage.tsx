import { useEffect, useState, type ReactNode } from "react";
import { appendRetryParam, getPublicAssetUrl } from "../utils/assets";

type WebSafeImageProps = {
  src?: string | null;
  alt: string;
  className: string;
  fallbackClassName: string;
  loading?: "eager" | "lazy";
  maxRetries?: number;
  children: ReactNode;
};

export default function WebSafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  loading = "lazy",
  maxRetries = 6,
  children,
}: WebSafeImageProps): JSX.Element {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const imageSrc = getPublicAssetUrl(src?.trim());
  const currentSrc = appendRetryParam(imageSrc, retryCount);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    setRetryCount(0);
  }, [imageSrc]);

  useEffect(() => {
    if (!imageSrc) {
      return;
    }

    let cancelled = false;
    let retryTimer: number | undefined;
    const preloader = new Image();

    preloader.decoding = "async";
    preloader.onload = () => {
      if (cancelled) {
        return;
      }

      setLoaded(true);
      setFailed(false);
    };
    preloader.onerror = () => {
      if (cancelled) {
        return;
      }

      setLoaded(false);

      if (retryCount >= maxRetries) {
        setFailed(true);
        return;
      }

      const retryDelay = Math.min(500 * 2 ** retryCount, 4000);
      retryTimer = window.setTimeout(() => {
        if (!cancelled) {
          setRetryCount((count) => count + 1);
        }
      }, retryDelay);
    };

    preloader.src = currentSrc;

    return () => {
      cancelled = true;
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };
  }, [currentSrc, imageSrc, maxRetries, retryCount]);

  const handleError = () => {
    if (retryCount < maxRetries) {
      const retryDelay = Math.min(500 * 2 ** retryCount, 4000);
      window.setTimeout(() => {
        setRetryCount((count) => count + 1);
      }, retryDelay);
      return;
    }

    setFailed(true);
  };

  return (
    <span className={`relative overflow-hidden ${fallbackClassName}`}>
      {imageSrc && loaded && !failed ? (
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          decoding="async"
          className={`${className} ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={handleError}
        />
      ) : null}
      {(!loaded || failed || !imageSrc) && (
        <span className="absolute inset-0 flex items-center justify-center">{children}</span>
      )}
    </span>
  );
}
