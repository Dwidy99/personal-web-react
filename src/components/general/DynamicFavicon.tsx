import { useEffect } from "react";
import PropTypes from "prop-types";

export default function DynamicFavicon({ faviconUrl }) {
  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [faviconUrl]);

  return null;
}

DynamicFavicon.propTypes = {
  faviconUrl: PropTypes.string.isRequired,
};
