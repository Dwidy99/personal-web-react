import { useEffect, useRef, useState } from "react";

export default function TopToButton(): JSX.Element | null {
  const toTopRef = useRef<HTMLButtonElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Handle scroll to toggle visibility
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY;
      setIsVisible(scrollTop > 200); // tampil setelah scroll > 200px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Return null jika belum visible
  if (!isVisible) return null;

  return (
    <button
      ref={toTopRef}
      id="to-top"
      className="fixed bottom-6 right-6 p-3 bg-primary text-white rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-primary/80 focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}
