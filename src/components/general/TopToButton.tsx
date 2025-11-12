import { useEffect, useRef, useState } from "react";

const TopToButton = () => {
  const toTopRef = useRef(null); // Reference for the to-top button
  const [isVisible, setIsVisible] = useState(false); // State to toggle visibility of the button

  // Handle scroll to toggle "to-top" button visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 200) {
        // Show button after scrolling 200px
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    isVisible && (
      <button
        ref={toTopRef}
        id="to-top"
        className="fixed bottom-6 right-6 p-3 bg-primary text-white rounded-full shadow-lg transition-all duration-300 ease-in-out"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    )
  );
};

export default TopToButton;
