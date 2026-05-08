import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import DOMPurify from "dompurify";
import LayoutWeb from "@/layouts/Web";
import { publicService } from "@/services/publicService";
import formatDate from "@/utils/Date";
import SEO from "@/components/general/SEO";
import ContentRenderer from "@/components/general/ContentRenderer";
import Loading from "@/components/web/Loading";

type Project = {
  title: string;
  description?: string;
  caption?: string;
  image?: string;
  link?: string;
  created_at?: string;
};

function toPlainText(value?: string): string {
  return DOMPurify.sanitize(value || "", {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
    .replace(/\s+/g, " ")
    .trim();
}

export default function ProjectShow() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  document.title = project?.title ? `${project.title} | Portfolio` : "Project | Portfolio";

  const fetchProject = useCallback(async () => {
    if (!slug) {
      setProject(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await publicService.getProjectBySlug(slug);
      setProject(data);
    } catch {
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) {
    return (
      <LayoutWeb disableSnow>
        <Loading message="Loading project..." variant="section" className="my-20" />
      </LayoutWeb>
    );
  }

  if (!project) {
    return (
      <LayoutWeb disableSnow>
        <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-red-500">Project not found</h1>
          <Link
            to="/projects"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Back to Projects
          </Link>
        </div>
      </LayoutWeb>
    );
  }

  const captionText = toPlainText(project.caption);
  const seoDescription = captionText || toPlainText(project.description);

  return (
    <LayoutWeb disableSnow>
      <SEO title={project.title} description={seoDescription} />

      <article className="mx-auto max-w-5xl">
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
        >
          <FaArrowLeft className="text-xs" />
          Back to projects
        </Link>

        <header className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="rounded-full border border-sky-200 px-3 py-1 text-xs font-semibold uppercase text-sky-600 dark:border-sky-500/40 dark:text-sky-400">
              Project Detail
            </span>
            {project.created_at && (
              <span className="inline-flex items-center gap-2">
                <FaCalendarAlt className="text-xs" />
                {formatDate(project.created_at)}
              </span>
            )}
          </div>

          <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-5xl">
            {project.title}
          </h1>

          {captionText && (
            <p className="mt-5 text-base leading-8 text-gray-600 dark:text-gray-300 md:text-lg">
              {captionText}
            </p>
          )}

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Visit live project
              <FaExternalLinkAlt className="text-xs" />
            </a>
          )}
        </header>

        {project.image && (
          <figure className="mt-10 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <img
              src={project.image}
              alt={project.title}
              className="max-h-[620px] w-full object-cover"
              loading="eager"
            />
          </figure>
        )}

        {project.description && (
          <section
            className="mt-10 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-7 md:p-9"
            aria-label="Project description"
          >
            <ContentRenderer
              content={project.description}
              className="
                text-gray-700 dark:text-gray-200
                prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-p:leading-8
                [&_img]:rounded-lg [&_img]:border [&_img]:border-gray-200 dark:[&_img]:border-gray-700
                [&_pre]:max-w-full [&_pre]:overflow-x-auto
                [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto
              "
            />
          </section>
        )}

        <footer className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-sky-500 hover:text-sky-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-sky-400 dark:hover:text-sky-400"
          >
            <FaArrowLeft className="text-xs" />
            Back to projects
          </Link>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-sky-600 dark:hover:bg-sky-700"
            >
              Open live project
              <FaExternalLinkAlt className="text-xs" />
            </a>
          )}
        </footer>
      </article>
    </LayoutWeb>
  );
}
