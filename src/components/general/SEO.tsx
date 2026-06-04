import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Api from "@/services/Api";
import DynamicFavicon from "./DynamicFavicon";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogUrl?: string;
}

interface ConfigData {
  site_name: string;
  abbreviation: string;
  tagline: string;
  meta_text: string;
  keywords: string[] | string;
  website_url: string;
  banner?: string | null;
  icon?: string | null;
  logo?: string | null;
}

export default function SEO({ title, description, keywords, canonical, ogUrl }: SEOProps) {
  const [config, setConfig] = useState<ConfigData | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await Api.get<{ data: ConfigData }>("/api/public/configurations");
        setConfig(res.data.data);
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
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
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
