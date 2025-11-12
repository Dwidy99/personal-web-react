import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Api from "@/services/Api";
import DynamicFavicon from "./DynamicFavicon";

interface SEOProps {
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
  keywords: string[];
  website_url: string;
  banner?: string | null;
  icon?: string | null;
  logo?: string | null;
}

export default function SEO({ description, keywords, canonical, ogUrl }: SEOProps) {
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

  if (!config) return null;

  const title = `${config.site_name} | ${config.abbreviation}`;
  const metaDesc = description || config.tagline || config.meta_text;
  const metaKeywords = keywords?.length ? keywords : config.keywords;

  const defaultImage =
    config.banner ||
    config.logo ||
    `${import.meta.env.VITE_API_URL}/storage/configurations/default-banner.png`;
  const faviconUrl =
    config.icon || `${import.meta.env.VITE_API_URL}/storage/configurations/default-icon.png`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDesc} />
        <meta name="keywords" content={metaKeywords.join(", ")} />
        <meta name="author" content={config.site_name} />
        <link rel="canonical" href={canonical || config.website_url} />

        {/* Favicon */}
        <link rel="icon" href={faviconUrl} type="image/png" sizes="16x16" />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:url" content={ogUrl || config.website_url} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={defaultImage} />
      </Helmet>

      <DynamicFavicon faviconUrl={faviconUrl} />
    </>
  );
}
