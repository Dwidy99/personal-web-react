import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import LayoutWeb from "@/layouts/Web";
import { publicService } from "@/services/publicService";
import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import formatDate from "@/utils/Date";
import SEO from "@/components/general/SEO";
import ContentRenderer from "@/components/general/SanitizedHTML";
import Loader from "@/components/general/Loader";
import hljs from "highlight.js";

export default function ProjectShow() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  document.title = "Project | Portfolio";

  const fetchProject = useCallback(async () => {
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

  /**
   * 🔥 Highlight Quill code blocks safely
   */
  useEffect(() => {
    if (!project?.description) return;

    const raf = requestAnimationFrame(() => {
      const blocks = document.querySelectorAll("pre.ql-syntax, pre code");

      blocks.forEach((block) => {
        const target =
          block.tagName.toLowerCase() === "pre"
            ? ((block.querySelector("code") as HTMLElement) ?? (block as HTMLElement))
            : (block as HTMLElement);

        // reset highlight.js marker
        target.removeAttribute("data-highlighted");
        target.classList.remove("hljs");

        // convert back to plain text (security-safe)
        const raw = target.textContent ?? "";
        target.textContent = raw;

        hljs.highlightElement(target);
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [project?.description]);

  if (loading) {
    return (
      <LayoutWeb>
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      </LayoutWeb>
    );
  }

  if (!project) {
    return (
      <LayoutWeb>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-red-500">Project not found</h1>
          <Link to="/projects" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Projects
          </Link>
        </div>
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb disableSnow>
      <SEO title={project.title} description={project.caption || project.description} />

      <article className="pt-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-10">
          {/* Header */}
          <header className="mb-6">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <FaCalendarAlt />
              <span>{formatDate(new Date(project.created_at))}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mt-3 text-gray-900 dark:text-gray-100">
              {project.title}
            </h1>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Visit Project <FaExternalLinkAlt className="text-sm" />
              </a>
            )}
          </header>

          {/* Content */}
          <section className="mt-6">
            <ContentRenderer content={project.description} className="prose dark:prose-invert" />
          </section>

          {/* Image */}
          {project.image && (
            <figure className="mt-10">
              <img
                src={project.image}
                alt={project.title}
                className="w-full max-h-[480px] object-cover rounded-lg shadow-md"
              />
            </figure>
          )}
        </div>
      </article>

      <nav className="text-center mt-10">
        <Link
          to="/projects"
          className="text-blue-600 hover:underline text-sm md:text-base font-medium"
        >
          ← Back to Projects
        </Link>
      </nav>
    </LayoutWeb>
  );
}
