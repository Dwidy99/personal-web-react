import type { PropsWithChildren, ReactNode } from "react";
import { Link } from "react-router-dom";
import { createExcerpt, toPlainText } from "../utils/text";

type WebContentCardProps = {
  title?: string;
  eyebrow?: string | null;
  description?: string | null;
  image?: string | null;
  link?: string;
  fallbackDescription?: string;
  children?: ReactNode;
};

function isExternalLink(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export default function WebContentCard({
  title,
  eyebrow,
  description,
  image,
  link,
  fallbackDescription = "A short look at one of the selected works in this portfolio.",
  children,
}: WebContentCardProps): JSX.Element {
  const cleanEyebrow = toPlainText(eyebrow);
  const cleanDescription = createExcerpt(description, 160) || fallbackDescription;

  const ImageLink = ({ children: imageChildren }: PropsWithChildren): JSX.Element => {
    if (!link) {
      return <>{imageChildren}</>;
    }

    if (isExternalLink(link)) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" aria-label={title}>
          {imageChildren}
        </a>
      );
    }

    return (
      <Link to={link} aria-label={title}>
        {imageChildren}
      </Link>
    );
  };

  return (
    <article className="group grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-lg border border-gray-200 bg-white/80 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/55 dark:hover:border-sky-500/40">
      {image && (
        <ImageLink>
          <div className="m-4 mb-0 aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-100 dark:bg-gray-950 dark:ring-gray-800">
            <img
              src={image}
              alt={title || "Content image"}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>
        </ImageLink>
      )}

      <div className="grid min-h-0 grid-rows-[auto_auto_1fr_auto] p-5 sm:p-6">
        {cleanEyebrow ? (
          <p className="mb-2 line-clamp-1 text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-300">
            {cleanEyebrow}
          </p>
        ) : (
          <span aria-hidden="true" />
        )}

        {title && (
          <h2 className="line-clamp-2 text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-300">
            {link && !isExternalLink(link) ? <Link to={link}>{title}</Link> : title}
          </h2>
        )}

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {cleanDescription}
        </p>

        <div className="mt-auto flex items-center justify-end pt-5">{children}</div>
      </div>
    </article>
  );
}
