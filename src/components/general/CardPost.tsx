import { Link } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";

interface Category {
  name?: string;
}

interface CardPostProps {
  index?: number;
  slug?: string;
  title?: string | null;
  content?: string | null;
  category?: Category;
  date?: string | Date | null;
}

export default function CardPost({
  index,
  slug = "#",
  title = "Untitled Post",
  content = "",
  category,
  date,
}: CardPostProps) {
  // ✅ Format tanggal aman
  let formattedDate = "—";
  if (date) {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      formattedDate = parsed.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }

  // ✅ Preview aman
  const preview =
    typeof content === "string" && content.trim().length > 0
      ? content.slice(0, 160)
      : "No description available.";

  return (
    <div
      key={index}
      className="flex flex-col justify-between gap-6 rounded-lg border-t border-gray-200 px-4 py-8 transition-all duration-300 hover:bg-gray-50 dark:border-gray-900 dark:hover:bg-gray-950 md:flex-row"
    >
      {/* ====== Konten utama ====== */}
      <div className="flex-2 space-y-2 order-2">
        <h2 className="text-lg font-semibold text-gray-900 transition-colors hover:text-black dark:text-white dark:hover:text-white">
          <Link to={`/blog/${slug}`}>{title}</Link>
        </h2>

        {category?.name && (
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
            {category.name}
          </p>
        )}

        <p
          className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl"
          dangerouslySetInnerHTML={{
            __html: `${preview}...`,
          }}
        ></p>

        <div>
          <Link
            to={`/blog/${slug}`}
            className="inline-flex items-center text-sm font-semibold text-gray-900 transition-colors hover:text-black dark:text-white dark:hover:text-gray-200"
          >
            Read more
            <GoArrowRight className="ml-1 text-base" />
          </Link>
        </div>
      </div>

      {/* ====== Kolom tanggal ====== */}
      <div className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest text-left md:text-left order-1 md:ml-8 flex-shrink-0">
        {formattedDate}
      </div>
    </div>
  );
}
