import { useEffect, useRef } from "react";

interface ClickOutsideProps {
  /** Elemen anak yang akan dibungkus */
  children: React.ReactNode;
  /** Ref elemen yang tidak memicu onClickOutside (pengecualian) */
  excludeRef?: React.RefObject<HTMLElement>;
  /** Fungsi yang dipanggil saat klik di luar wrapper */
  onClickOutside: () => void;
  /** Kelas tambahan opsional */
  className?: string;
}

/**
 * Komponen pembungkus yang mendeteksi klik di luar elemen.
 * Contoh penggunaan:
 * <ClickOutside onClickOutside={() => setOpen(false)} excludeRef={buttonRef}>
 *   <DropdownMenu />
 * </ClickOutside>
 */
export default function ClickOutside({
  children,
  excludeRef,
  onClickOutside,
  className = "",
}: ClickOutsideProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInside =
        wrapperRef.current?.contains(target) || excludeRef?.current?.contains(target);

      if (!clickedInside) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [excludeRef, onClickOutside]);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
}
