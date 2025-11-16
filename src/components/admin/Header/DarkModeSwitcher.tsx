import { useEffect, useState } from "react";

export default function DarkModeSwitcher() {
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  // 🧠 Inisialisasi awal dari localStorage atau preferensi sistem
  useEffect(() => {
    const storedMode = localStorage.getItem("color-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialMode = storedMode || (prefersDark ? "dark" : "light");

    setColorMode(initialMode);
    document.documentElement.classList.toggle("dark", initialMode === "dark");
  }, []);

  // 🎨 Toggle mode dan simpan ke localStorage
  const toggleMode = () => {
    const newMode = colorMode === "light" ? "dark" : "light";
    setColorMode(newMode);
    localStorage.setItem("color-theme", newMode);
    document.documentElement.classList.toggle("dark", newMode === "dark");
  };

  return (
    <li>
      <label
        className={`relative block h-7.5 w-14 rounded-full transition-colors duration-300 ${
          colorMode === "dark" ? "bg-primary" : "bg-stroke dark:bg-strokedark"
        }`}
      >
        {/* Toggle button (invisible input) */}
        <input
          type="checkbox"
          onChange={toggleMode}
          checked={colorMode === "dark"}
          className="absolute inset-0 z-50 cursor-pointer opacity-0"
          aria-label="Toggle dark mode"
        />

        {/* Sliding indicator */}
        <span
          className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transform transition-all duration-300 ease-in-out ${
            colorMode === "dark" ? "translate-x-7" : "translate-x-0"
          }`}
        >
          {colorMode === "light" ? (
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M8 12.667a4.667 4.667 0 100-9.334 4.667 4.667 0 000 9.334z" fill="#969AA1" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                d="M14.353 10.62c-.106-.18-.406-.46-1.153-.327-.413.073-.833.106-1.253.087a6.002 6.002 0 01-3.94-1.88A6.017 6.017 0 016.6 4.913a5.47 5.47 0 01.946-2.187c.294-.673.087-1.026-.06-1.173-.153-.153-.513-.366-1.22-.073A6.997 6.997 0 001.553 8.287a6.669 6.669 0 004.693 5.993c.613.213 1.26.34 1.927.367 2.233 0 4.326-1.053 5.646-2.847.447-.62.327-1.013.214-1.18z"
                fill="#969AA1"
              />
            </svg>
          )}
        </span>
      </label>
    </li>
  );
}
