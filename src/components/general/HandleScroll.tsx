// src/components/general/HandleScroll.tsx
import { useEffect } from "react";
import PropTypes from "prop-types";

const HandleScroll = ({ setIsFixed, toTopRef }) => {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (!header) return;

      const fixedNav = header.offsetTop;
      const scrollTop = window.scrollY;

      if (scrollTop > fixedNav) {
        setIsFixed(true);

        if (toTopRef.current) {
          toTopRef.current.classList.remove("hidden");
          toTopRef.current.classList.add("flex");
        }
      } else {
        setIsFixed(false);

        if (toTopRef.current) {
          toTopRef.current.classList.add("hidden");
          toTopRef.current.classList.remove("flex");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger once on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setIsFixed, toTopRef]);

  return null;
};

HandleScroll.propTypes = {
  setIsFixed: PropTypes.func.isRequired,
  toTopRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
};

export default HandleScroll;
