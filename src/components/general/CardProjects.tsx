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

const isExternalLink = (url: string): boolean => /^https?:\/\//i.test(url);

function toPlainText(value?: string): string {
  return DOMPurify.sanitize(value || "", {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
    .replace(/\s+/g, " ")
    .trim();
}

export default function CardProjects({
  title,
  description,
  image,
  caption,
  link,
  children,
}: CardProjectsProps): JSX.Element {
  const cleanCaption = toPlainText(caption);
  const cleanDescription = toPlainText(description);

  const ImageWrapper = ({ children }: PropsWithChildren): JSX.Element => {
    if (!link) return <>{children}</>;

    if (isExternalLink(link)) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" aria-label={title}>
          {children}
        </a>
      );
    }

    return (
      <Link to={link} aria-label={title}>
        {children}
      </Link>
    );
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white/80 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/55 dark:hover:border-sky-500/40">
      {image && (
        <ImageWrapper>
          <div className="m-4 mb-0 aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-100 dark:bg-gray-950 dark:ring-gray-800">
            <img
              src={image}
              alt={title || "Project image"}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </ImageWrapper>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {cleanCaption && (
          <p className="mb-2 line-clamp-1 text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-300">
            {cleanCaption}
          </p>
        )}

        {title && (
          <h2 className="line-clamp-2 text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-300">
            {title}
          </h2>
        )}

        {cleanDescription && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
            {cleanDescription}
          </p>
        )}

        <div className="mt-auto flex items-center justify-end pt-5">{children}</div>
      </div>
    </article>
  );
}
