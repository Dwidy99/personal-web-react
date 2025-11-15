import { useRef, useEffect, useState } from "react";

interface Experience {
  image: string;
  name: string;
  start_date: string;
  end_date: string;
  description?: string;
  highlights?: string[];
}

interface AccordionItemProps {
  exp: Experience;
  isOpen: boolean;
  onClick: (index: number) => void;
  index: number;
  formatDate: (date: string) => string;
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
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden transition-all">
      {/* Header */}
      <button
        onClick={() => onClick(index)}
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${index}`}
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 min-w-[3rem] rounded-md bg-white dark:bg-gray-700 overflow-hidden flex items-center justify-center">
            <img
              src={exp.image}
              alt={`${exp.name} logo`}
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
              className="object-contain h-10 w-10 p-1"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = "/placeholder-image.svg";
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{exp.name}</h3>
            <p className="text-sm text-gray-500">
              {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
            </p>
          </div>
        </div>

        <span
          className="text-gray-500 ml-2 transition-transform duration-200"
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
        className="px-4 overflow-hidden transition-all duration-300 bg-white dark:bg-gray-900"
        style={{ height: `${height}px` }}
        aria-hidden={!isOpen}
      >
        <div className="py-3 text-sm text-gray-700 dark:text-gray-300">
          {exp.description && (
            <div
              className="my-4 text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: exp.description }}
            />
          )}

          {exp.highlights && exp.highlights.length > 0 && (
            <ul className="list-disc ml-5 space-y-2 mt-4 text-gray-600 dark:text-gray-400 pb-3">
              {exp.highlights.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
