import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

export default function CardProjects({
  title,
  description,
  image,
  caption,
  link,
  children,
}) {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {image &&
        (link ? (
          <Link to={link}>
            <img
              src={image}
              alt={title || "Project image"}
              className="w-full h-60 object-cover hover:opacity-90 transition-opacity duration-300"
            />
          </Link>
        ) : (
          <Link to={link}>
            <img
              src={image}
              alt={title || "Project image"}
              className="w-full h-60 object-cover"
            />
          </Link>
        ))}

      <div className="p-6 flex flex-col flex-grow">
        {caption && (
          <div className="flex items-start gap-x-2 text-sm text-gray-700 mb-4">
            <span className="font-semibold whitespace-nowrap">Built with:</span>
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(caption),
              }}
            />
          </div>
        )}

        {/* Deskripsi */}
        {description && (
          <p
            className="text-gray-600 text-base mb-4 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description),
            }}
          ></p>
        )}

        {/* Tombol / Elemen Anak */}
        <div className="mt-auto text-right">{children}</div>
      </div>
    </div>
  );
}

CardProjects.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  caption: PropTypes.string,
  image: PropTypes.string,
  link: PropTypes.string, // ✅ new prop
  children: PropTypes.node,
};
