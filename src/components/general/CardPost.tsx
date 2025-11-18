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
      className="flex flex-col md:flex-row justify-between gap-6 border-t border-gray-200 dark:border-gray-800 py-8 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-boxdark/40 rounded-lg px-4"
    >
      {/* ====== Konten utama ====== */}
      <div className="flex-2 space-y-2 order-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-sky-600 transition-colors">
          <Link to={`/blog/${slug}`}>{title}</Link>
        </h2>

        {category?.name && (
          <p className="text-xs uppercase tracking-wide text-sky-600 font-medium">
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
            className="inline-flex items-center text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
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
