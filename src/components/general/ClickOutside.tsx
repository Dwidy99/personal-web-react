import { useEffect, useRef } from "react";

export interface ClickOutsideProps {
  children: React.ReactNode;
  /** Fungsi yang dijalankan ketika klik di luar elemen */
  onClickOutside: () => void;
  /** Elemen ref yang dikecualikan (tidak memicu onClickOutside) */
  excludeRef?: React.RefObject<HTMLElement>;
  /** Opsional: class tambahan untuk wrapper */
  className?: string;
}

export default function ClickOutside({
  children,
  onClickOutside,
  excludeRef,
  className = "",
}: ClickOutsideProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        ref.current &&
        !ref.current.contains(target) &&
        (!excludeRef?.current || !excludeRef.current.contains(target))
      ) {
        onClickOutside();
      }
    };

    // Gunakan 'mousedown' agar lebih responsif
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [onClickOutside, excludeRef]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
