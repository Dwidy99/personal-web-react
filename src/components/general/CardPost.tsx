import { Link } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";

interface Category {
  name?: string;
}

interface CardPostProps {
  index?: number;
  slug?: string; // ✅ bahkan slug optional biar gak crash
  title?: string | null;
  content?: string | null;
  category?: Category;
  date?: string | Date | null;
}

export default function CardPost({
  index,
  slug = "#", // ✅ fallback aman
  title = "Untitled Post",
  content = "",
  category,
  date,
}: CardPostProps) {
  // ✅ Aman untuk semua format tanggal
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

  // ✅ content aman tanpa substring error
  const preview =
    typeof content === "string" && content.trim().length > 0
      ? content.slice(0, 160)
      : "No description available.";

  return (
    <li
      key={index}
      className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-x-10 gap-y-4 border-t border-gray-200 dark:border-gray-800 py-8"
    >
      {/* Kolom kiri - tanggal */}
      <div className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest md:text-right">
        {formattedDate}
      </div>

      {/* Kolom kanan */}
      <div className="space-y-2">
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
    </li>
  );
}
