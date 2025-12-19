import { useEffect, useRef, useState } from "react";

export type ExperienceItem = {
  id?: number | string;
  image?: string | null;
  name?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string;
  highlights?: string[];
};

interface AccordionItemProps {
  exp: ExperienceItem;
  isOpen: boolean;
  onClick: (index: number) => void;
  index: number;
  formatDate: (date: string | null | undefined) => string;
}

export default function AccordionItem({
  exp,
  isOpen,
  onClick,
  index,
  formatDate,
}: AccordionItemProps): JSX.Element {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (isOpen && contentRef.current) setHeight(contentRef.current.scrollHeight);
    else setHeight(0);
  }, [isOpen]);

  const safeName = exp.name?.trim() || "Untitled Experience";
  const safeImage = exp.image?.trim() || "/no-image.png";

  return (
    <div className="overflow-hidden rounded-xl border border-stroke bg-white shadow-sm transition-all dark:border-strokedark dark:bg-boxdark">
      {/* Header */}
      <button
        type="button"
        onClick={() => onClick(index)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left hover:bg-slate-50 dark:hover:bg-white/5"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${index}`}
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 min-w-[3rem] overflow-hidden rounded-lg border border-stroke bg-white dark:border-strokedark dark:bg-boxdark-2">
            <img
              src={safeImage}
              alt={`${safeName} logo`}
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/no-image.png";
              }}
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900 dark:text-white">{safeName}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
            </p>
          </div>
        </div>

        <span
          className="select-none text-slate-500 transition-transform duration-200"
          aria-hidden="true"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>

      {/* Content */}
      <div
        ref={contentRef}
        id={`accordion-content-${index}`}
        className="overflow-hidden bg-white px-4 transition-all duration-300 dark:bg-boxdark"
        style={{ height: `${height}px` }}
        aria-hidden={!isOpen}
      >
        <div className="py-4 text-sm text-slate-700 dark:text-slate-300">
          {exp.description ? (
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: exp.description }}
            />
          ) : null}

          {exp.highlights?.length ? (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-400">
              {exp.highlights.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
