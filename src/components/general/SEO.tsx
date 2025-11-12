import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Api from "../../services/Api";
import DynamicFavicon from "./DynamicFavicon";

export default function SEO({ description, keywords, canonical, ogUrl }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await Api.get("/api/public/configurations");
        const data = response.data.data;

        if (!data) throw new Error("No configuration data found");

        const parsedKeywords = data.keywords
          ? data.keywords.split(",").map((k) => k.trim())
          : ["default", "keywords"];

        setConfig({
          site_name: data.site_name || "Default Site Name",
          abbreviation: data.abbreviation || "Default Abbreviation",
          tagline: data.tagline || "Default Tagline",
          meta_text: data.meta_text || "",
          keywords: parsedKeywords,
          website_url: data.website_url || "http://localhost",
          banner: data.banner || null,
          icon: data.icon || null,
          logo: data.logo || null,
        });
      } catch (error) {
        console.log("Error loading configuration:", error);
      }
    };

    fetchConfig();
  }, []);

  if (!config) return null;

  const defaultTitle = `${config.site_name} | ${config.abbreviation}`;
  const defaultDescription =
    description || config.tagline || config.meta_text || "Default description";
  const defaultKeywords =
    keywords && keywords.length ? keywords : config.keywords;

  const imageUrl = config.banner
    ? config.banner
    : config.logo
      ? config.logo
      : `${import.meta.env.VITE_API_URL}/storage/configurations/default-banner.png`;

  const faviconUrl = config.icon
    ? config.icon
    : `${import.meta.env.VITE_API_URL}/storage/configurations/default-icon.png`;

  return (
    <>
      <Helmet>
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} />
        <meta name="keywords" content={defaultKeywords.join(", ")} />
        <meta name="author" content={config.site_name} />
        <link rel="canonical" href={canonical || config.website_url} />
        <meta name="robots" content="index, follow" />

        {/* Favicon */}
        <link rel="icon" href={faviconUrl} type="image/png" sizes="16x16" />

        {/* Open Graph */}
        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={ogUrl || config.website_url} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={defaultTitle} />
        <meta name="twitter:description" content={defaultDescription} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:url" content={ogUrl || config.website_url} />
      </Helmet>
      <DynamicFavicon faviconUrl={faviconUrl} />
    </>
  );
}

SEO.propTypes = {
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  canonical: PropTypes.string,
  ogUrl: PropTypes.string,
};
