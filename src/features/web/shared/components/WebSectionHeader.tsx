import { Link } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";

type WebSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    to: string;
  };
};

export default function WebSectionHeader({
  eyebrow,
  title,
  description,
  action,
}: WebSectionHeaderProps): JSX.Element {
  return (
    <div className="mb-7 grid gap-4 text-center md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:text-left">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-500 dark:text-sky-300">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white md:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
          {description}
        </p>
      </div>

      {action && (
        <Link
          to={action.to}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-white"
        >
          {action.label}
          <GoArrowRight className="text-base" />
        </Link>
      )}
    </div>
  );
}
