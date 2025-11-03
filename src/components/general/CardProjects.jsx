import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

/**
 * Helper untuk cek apakah link eksternal
 */
const isExternalLink = (url) => /^https?:\/\//i.test(url);

export default function CardProjects({
  title,
  description,
  image,
  caption,
  link,
  children,
}) {
  // 🔹 Tentukan elemen pembungkus gambar berdasarkan jenis link
  const ImageWrapper = ({ children }) => {
    if (!link) return children;

    if (isExternalLink(link)) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }

    // internal link (react-router-dom)
    return <Link to={link}>{children}</Link>;
  };

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {/* 🔹 Gambar (klik = link) */}
      {image && (
        <ImageWrapper>
          <img
            src={image}
            alt={title || "Project image"}
            className="w-full h-60 object-cover hover:opacity-90 transition-opacity duration-300"
          />
        </ImageWrapper>
      )}

      {/* 🔹 Isi Card */}
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

        {description && (
          <p
            className="text-gray-600 text-base mb-4 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description),
            }}
          ></p>
        )}

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
  link: PropTypes.string,
  children: PropTypes.node,
};
