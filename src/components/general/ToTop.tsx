import { useEffect, useState } from "react";

export default function ToTop(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href="#home"
      id="to-top"
      aria-label="to-top"
      className={`fixed bottom-4 right-4 h-14 w-14 z-[9999] rounded-full bg-primary p-4 justify-center transition-all duration-300 ${
        isVisible ? "flex" : "hidden"
      }`}
    >
      <span className="block h-5 w-5 rotate-45 border-t-2 border-l-2 border-white"></span>
    </a>
  );
}
