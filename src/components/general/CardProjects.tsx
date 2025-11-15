import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { ReactNode, PropsWithChildren } from "react";

interface CardProjectsProps {
  title?: string;
  description?: string;
  caption?: string;
  image?: string;
  link?: string;
  children?: ReactNode;
}

/**
 * Helper untuk cek apakah link eksternal
 */
const isExternalLink = (url: string): boolean => /^https?:\/\//i.test(url);

/**
 * CardProjects Component
 */
export default function CardProjects({
  title,
  description,
  image,
  caption,
  link,
  children,
}: CardProjectsProps): JSX.Element {
  /**
   * Sub-komponen wrapper untuk gambar
   */
  const ImageWrapper = ({ children }: PropsWithChildren): JSX.Element => {
    if (!link) return <>{children}</>;

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
            loading="lazy"
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
