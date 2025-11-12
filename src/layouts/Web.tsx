import "../assets/web/css/index.css";
import "../assets/web/css/tailwind.css";
import "../assets/web/js/script.js";
// Di index.js atau App.js
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import Navbar from "../components/web/Navbar.tsx";
import Footer from "../components/web/Footer.tsx";
import SnowEffect from "../components/general/SnowEffect";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

export default function Web({
  children,
  pageTitle,
  pageDescription,
  disableSnow,
}) {
  return (
    <>
      {!disableSnow && <SnowEffect />}
      <Helmet>
        <title>
          {pageTitle || "Dwi's Portfolio | Web Developer & Tech Enthusiast"}
        </title>
        <meta
          name="description"
          content={
            pageDescription ||
            "Personal portfolio showcasing projects in web development, React, and Laravel"
          }
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <div
        className="site-wrapper"
        itemScope
        itemType="https://schema.org/WebPage"
      >
        <header
          role="banner"
          aria-label="Main website header"
          itemScope
          itemType="https://schema.org/WPHeader"
        >
          <Navbar />
        </header>

        <main
          id="main-content"
          role="main"
          className="min-h-[calc(100vh-160px)]"
        >
          {children ?? (
            <section aria-labelledby="missing-content-heading">
              <h1 id="missing-content-heading" className="sr-only">
                Missing Content
              </h1>
              <p role="alert">Children are missing</p>
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

Web.propTypes = {
  children: PropTypes.node,
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string,
  disableSnow: PropTypes.bool,
};
