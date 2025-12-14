import { useEffect, useState, useCallback } from "react";
import LayoutWeb from "../../../layouts/Web";
import { publicService } from "../../../services/publicService";
import { Link, useParams } from "react-router-dom";
import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import formatDate from "../../../utils/Date";
import SEO from "../../../components/general/SEO";
import ContentRenderer from "../../../components/general/SanitizedHTML";
import Loader from "@/components/general/Loader";
import hljs from "highlight.js";

export default function ProjectShow() {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  document.title = "Project | Portfolio Blogs";

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

  useEffect(() => {
    if (!project) return;

    // highlight Quill code blocks (<pre class="ql-syntax">)
    const blocks = document.querySelectorAll("pre.ql-syntax, pre code");

    blocks.forEach((el) => {
      hljs.highlightElement(el as HTMLElement);
    });
  }, [project]);

  if (loading) {
    return (
      <LayoutWeb>
        <main className="container mx-auto px-4 py-20">
          <Loader />
        </main>
      </LayoutWeb>
    );
  }

  if (!project) {
    return (
      <LayoutWeb>
        <main className="container text-center py-20">
          <h1 className="text-2xl font-bold text-red-500">Project not found</h1>
          <a href="/projects" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Projects
          </a>
        </main>
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb disableSnow>
      <SEO title={project.title} description={project.caption || project.description} />

      <main className="container mx-auto px-6 pt-10 sm:px-8 md:px-10 mt-10 md:mt-16 lg:mt-25.5">
        <article className="bg-white mt-10 dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-10">
          <header className="mb-6">
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
              <FaCalendarAlt className="inline" />
              <span>{formatDate(new Date(project.created_at))}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mt-3 text-gray-800 dark:text-gray-100">
              {project.title}
            </h1>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 mt-3 hover:underline"
              >
                Visit Project <FaExternalLinkAlt className="text-sm" />
              </a>
            )}
          </header>

          <section className="prose dark:prose-invert max-w-none">
            <ContentRenderer content={project.description} isQuillContent />
          </section>

          {project.image && (
            <figure className="mt-10">
              <img
                src={project.image}
                alt={project.title}
                className="w-full rounded-lg shadow-md object-cover max-h-[480px]"
              />
            </figure>
          )}
        </article>

        <nav className="text-center mt-10">
          <Link
            to="/projects"
            className="text-blue-600 hover:underline text-sm md:text-base font-medium"
          >
            ← Back to Projects
          </Link>
        </nav>
      </main>
    </LayoutWeb>
  );
}
