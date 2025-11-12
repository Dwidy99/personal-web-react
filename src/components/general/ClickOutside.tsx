import { useEffect, useRef } from "react";

// Komponen ClickOutside untuk menangani klik di luar elemen
const ClickOutside = ({ children, onClickOutside, excludeRef }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        (!excludeRef.current || !excludeRef.current.contains(e.target))
      ) {
        onClickOutside();
      }
    };

    // Tambahkan event listener untuk mendeteksi klik di luar
    window.addEventListener("click", handleClickOutside);

    // Hapus event listener saat komponen dibersihkan
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [onClickOutside, excludeRef]);

  return <div ref={ref}>{children}</div>;
};

export default ClickOutside;
