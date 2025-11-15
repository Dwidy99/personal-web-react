import { useEffect } from "react";

interface DynamicFaviconProps {
  faviconUrl: string;
}

export default function DynamicFavicon({ faviconUrl }: DynamicFaviconProps): null {
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [faviconUrl]);

  return null;
}
