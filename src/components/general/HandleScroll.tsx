import { useEffect, RefObject } from "react";

interface HandleScrollProps {
  setIsFixed: (value: boolean) => void;
  toTopRef: RefObject<HTMLElement>;
}

export default function HandleScroll({ setIsFixed, toTopRef }: HandleScrollProps): null {
  useEffect(() => {
    const handleScroll = (): void => {
      const header = document.querySelector<HTMLElement>("header");
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
}
