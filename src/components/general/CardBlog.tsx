import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { toPlainText } from "@/utils/text";

interface Category {
  name?: string;
  slug?: string;
}

interface CardBlogProps {
  title: string;
  category?: Category | null;
  content?: string;
  image?: string;
  slug?: string;
  children?: ReactNode;
}

export default function CardBlog({
  title,
  category = null,
  content = "",
  image = "",
  slug = "",
  children = null,
}: CardBlogProps): JSX.Element {
  const preview = toPlainText(content).slice(0, 110);

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {image && <img src={image} alt={title} className="w-full h-48 object-cover" loading="lazy" />}

      <div className="p-6 flex flex-col flex-grow">
        {title && (
          <Link to={`/blog/${slug}`}>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </Link>
        )}

        <span>
          {category?.name && (
            <Link
              to={`/blog/category/${category.slug}`}
              className="text-xs text-blue-600 font-medium mb-3"
            >
              {category.name}
            </Link>
          )}
        </span>

        <p className="text-left text-sm text-gray-500">
          {preview || "No description available."}
          {preview.length >= 110 ? "..." : ""}
        </p>

        <div className="mt-auto text-right">{children}</div>
      </div>
    </div>
  );
}
