import { useState } from "react";
import { Link } from "react-router-dom";
import { MdCategory } from "react-icons/md";

type WebCategoryPillProps = {
  name: string;
  slug: string;
  image?: string | null;
};

export default function WebCategoryPill({
  name,
  slug,
  image,
}: WebCategoryPillProps): JSX.Element {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(image) && !imageFailed;

  return (
    <Link
      to={`/blog/category/${slug}`}
      className="group inline-grid min-h-12 grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-3 pr-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-white"
    >
      <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-950 text-white ring-1 ring-slate-200 transition duration-300 group-hover:scale-105 dark:bg-white dark:text-slate-950 dark:ring-white/20">
        {showImage ? (
          <img
            src={image || ""}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <MdCategory className="text-base" aria-hidden="true" />
        )}
      </span>
      <span className="max-w-[13rem] truncate">{name}</span>
    </Link>
  );
}
