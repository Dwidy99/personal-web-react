import { Link } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";

// ✅ Define TypeScript types
interface Category {
  name: string;
}

interface CardPostProps {
  index?: number;
  image?: string;
  slug: string;
  title?: string;
  content: string;
  category?: Category;
  date: string | Date;
}

export default function CardPost({
  index,
  image,
  slug,
  title,
  content,
  category,
  date,
}: CardPostProps) {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <li key={index} className="grid grid-cols-3 gap-4 mb-6 sm:flex sm:flex-wrap lg:grid">
      <div className="flex mb-4 min-w-0 flex-auto">
        <p className="text-md font-semibold text-gray-500">{formattedDate}</p>
      </div>

      <div className="col-span-2 flex flex-col justify-start sm:flex sm:items-start">
        {/* ✅ optional image */}
        {image && (
          <img
            src={image}
            alt={title || "Post image"}
            className="w-full mb-3 rounded-lg object-cover"
          />
        )}

        <span className="font-bold text-lg text-gray-800 dark:text-gray-100 text-left">
          {title || "Untitled Post"}
        </span>

        {category && (
          <span className="text-xs text-blue-600 font-medium mb-2">{category.name}</span>
        )}

        <span
          className="text-sm text-gray-600 dark:text-gray-400 text-left"
          dangerouslySetInnerHTML={{
            __html: `${content.substring(0, 120)}...`,
          }}
        ></span>

        <p className="mt-1 text-sm font-medium text-right text-blue-600">
          <Link to={`/blog/${slug}`} className="hover:underline">
            Read more <GoArrowRight className="inline" />
          </Link>
        </p>
      </div>
    </li>
  );
}
