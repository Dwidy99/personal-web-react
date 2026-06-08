import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import DynamicFavicon from "./DynamicFavicon";
import { publicWebApi } from "@/features/web/shared/api/publicWebApi";
import type { WebConfiguration } from "@/types/web";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogUrl?: string;
}

export default function SEO({ title, description, keywords, canonical, ogUrl }: SEOProps) {
  const [config, setConfig] = useState<WebConfiguration | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setConfig(await publicWebApi.getConfiguration());
      } catch (error) {
        console.error("Error loading configuration:", error);
      }
    };

    fetchConfig();
  }, []);

  if (!config) {
    return null;
  }

  const pageTitle = title
    ? `${title} | ${config.site_name}`
    : `${config.site_name} | ${config.abbreviation}`;
  const metaDesc = description || config.tagline || config.meta_text;
  const rawKeywords: string[] | string | undefined = keywords?.length ? keywords : config.keywords;
  const metaKeywords = Array.isArray(rawKeywords)
    ? rawKeywords
    : typeof rawKeywords === "string"
      ? rawKeywords.split(",").map((keyword) => keyword.trim())
      : [];
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const defaultImage =
    config.banner || config.logo || `${apiBaseUrl}/storage/configurations/default-banner.png`;
  const faviconUrl = config.icon || `${apiBaseUrl}/storage/configurations/default-icon.png`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="keywords" content={metaKeywords.join(", ")} />
        <meta name="author" content={config.site_name} />
        <link rel="canonical" href={canonical || config.website_url} />

        <link rel="icon" href={faviconUrl} type="image/png" sizes="16x16" />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:url" content={ogUrl || config.website_url} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={defaultImage} />
      </Helmet>

      <DynamicFavicon faviconUrl={faviconUrl} />
    </>
  );
}
