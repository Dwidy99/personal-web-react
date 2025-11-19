import "@/assets/web/css/index.css";
import "@/assets/web/css/tailwind.css";
import "@/assets/web/js/script.js";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import Navbar from "@/components/web/Navbar";
import Footer from "@/components/web/Footer";
import SnowEffect from "@/components/general/SnowEffect";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

interface WebLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  disableSnow?: boolean;
}

export default function WebLayout({
  children,
  pageTitle,
  pageDescription,
  disableSnow = false,
}: WebLayoutProps) {
  const defaultTitle = pageTitle || "Dwi's Portfolio | Web Developer & Tech Enthusiast";
  const defaultDesc =
    pageDescription ||
    "Personal portfolio showcasing projects in web development, React, and Laravel";

  // 🔒 Disable copy, right-click, and text select ONLY on Web
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleSelect = (e: Event) => e.preventDefault();

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("selectstart", handleSelect);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("selectstart", handleSelect);
    };
  }, []);

  return (
    <>
      {!disableSnow && <SnowEffect />}
      <Helmet>
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDesc} />
      </Helmet>

      <div className="site-wrapper select-none" itemScope itemType="https://schema.org/WebPage">
        <header
          role="banner"
          aria-label="Main Header"
          itemScope
          itemType="https://schema.org/WPHeader"
        >
          <Navbar />
        </header>

        <main id="main-content" role="main" className="min-h-[calc(100vh-160px)]">
          {children ?? (
            <section aria-labelledby="missing-content-heading">
              <h1 id="missing-content-heading" className="sr-only">
                Missing Content
              </h1>
              <p role="alert" className="text-center py-10 text-gray-500">
                No content provided.
              </p>
            </section>
          )}
        </main>

        <footer
          role="contentinfo"
          aria-label="Website footer"
          itemScope
          itemType="https://schema.org/WPFooter"
        >
          <Footer />
        </footer>
      </div>
    </>
  );
}
