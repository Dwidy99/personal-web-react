import { useEffect, useState } from "react";

export default function ToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href="#home"
      className={`fixed flex justify-center bottom-4 right-4 p-4 rounded-full h-14 w-14 bg-primary z-[9999] ${
        isVisible ? "flex" : "hidden"
      }`}
      id="to-top"
      aria-label="to-top"
    >
      <span className="block h-5 w-5 border-t-2 border-l-2 rotate-45"></span>
    </a>
  );
}
