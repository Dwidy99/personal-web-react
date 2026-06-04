import { Link } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import { MdCalendarMonth } from "react-icons/md";
import type { WebPost } from "../types";
import { createExcerpt } from "../utils/text";

type WebPostListItemProps = {
  post: WebPost;
};

function formatPublishedDate(date?: string | null): string {
  if (!date) {
    return "-";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function WebPostListItem({ post }: WebPostListItemProps): JSX.Element {
  const preview = createExcerpt(post.content, 150) || "No description available.";

  return (
    <li className="group grid min-h-[172px] grid-cols-1 gap-5 rounded-lg border border-gray-200 bg-white/80 p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/55 dark:hover:border-sky-500/40 sm:p-6 lg:grid-cols-[168px_minmax(0,1fr)_132px] lg:items-center">
      <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-3 lg:block">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300 lg:mb-3">
          <MdCalendarMonth className="text-xl" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
            Published
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {formatPublishedDate(post.created_at)}
          </p>
        </div>
      </div>

      <article className="min-w-0">
        {post.category?.name && (
          <p className="mb-2 line-clamp-1 text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-300">
            {post.category.name}
          </p>
        )}

        <h2 className="line-clamp-2 text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-300">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-400">
          {preview}
        </p>
      </article>

      <div className="flex items-center lg:justify-end">
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-900 transition hover:border-sky-300 hover:text-sky-600 dark:border-gray-700 dark:text-white dark:hover:border-sky-400 dark:hover:text-sky-300"
        >
          Read more
          <GoArrowRight className="text-base" />
        </Link>
      </div>
    </li>
  );
}
