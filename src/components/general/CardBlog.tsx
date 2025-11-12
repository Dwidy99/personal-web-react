import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function CardBlog({
  title,
  category = null, // Default parameter instead of defaultProps
  content = "", // Default parameter instead of defaultProps
  image = "", // Default parameter instead of defaultProps
  slug = "", // Default parameter instead of defaultProps
  children = null, // Default parameter instead of defaultProps
}) {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {image && (
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      )}
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
        <span
          className="text-sm text-gray-500 text-left"
          dangerouslySetInnerHTML={{
            __html: content?.substring(0, 110) + "...",
          }}
        ></span>
        <div className="mt-auto text-right">{children}</div>
      </div>
    </div>
  );
}

CardBlog.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  image: PropTypes.string,
  slug: PropTypes.string,
  children: PropTypes.node,
  category: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  }),
};
