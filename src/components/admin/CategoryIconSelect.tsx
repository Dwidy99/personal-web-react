import { useEffect, useMemo, useRef, useState } from "react";
import { MdCategory, MdCheck, MdKeyboardArrowDown } from "react-icons/md";

export type CategoryIconOption = {
  value: string;
  label: string;
  image?: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: CategoryIconOption[];
  placeholder?: string;
  disabled?: boolean;
};

function CategoryIcon({ image, label }: Pick<CategoryIconOption, "image" | "label">) {
  const [imageFailed, setImageFailed] = useState(false);

  if (image && !imageFailed) {
    return (
      <img
        src={image}
        alt=""
        className="h-9 w-9 rounded-lg border border-stroke bg-white object-cover dark:border-strokedark dark:bg-boxdark"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <span
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stroke bg-slate-50 text-slate-500 dark:border-strokedark dark:bg-boxdark-2 dark:text-slate-300"
      aria-hidden="true"
      title={label}
    >
      <MdCategory className="text-lg" />
    </span>
  );
}

export default function CategoryIconSelect({
  value,
  onChange,
  options,
  placeholder = "Select category",
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectOption = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        className="flex min-h-[54px] w-full items-center justify-between gap-3 rounded-lg border border-stroke bg-white px-3 py-2 text-left text-sm text-slate-800 shadow-sm transition hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-strokedark dark:bg-boxdark dark:text-white"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex min-w-0 items-center gap-3">
          <CategoryIcon image={selected?.image} label={selected?.label || placeholder} />
          <span className="min-w-0">
            <span className="block truncate font-medium">
              {selected?.label || placeholder}
            </span>
            <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
              {selected ? "Category selected" : "Choose from database categories"}
            </span>
          </span>
        </span>
        <MdKeyboardArrowDown
          className={`shrink-0 text-xl text-slate-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-y-auto rounded-lg border border-stroke bg-white p-1 shadow-xl dark:border-strokedark dark:bg-boxdark">
          {options.length > 0 ? (
            <ul role="listbox" className="space-y-1">
              {options.map((option) => {
                const active = option.value === value;

                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                        active
                          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-300"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                      }`}
                      role="option"
                      aria-selected={active}
                      onClick={() => selectOption(option.value)}
                    >
                      <CategoryIcon image={option.image} label={option.label} />
                      <span className="min-w-0 flex-1 truncate font-medium">{option.label}</span>
                      {active && <MdCheck className="text-lg" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-3 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
              No categories found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
