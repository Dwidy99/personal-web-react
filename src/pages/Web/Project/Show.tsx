import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import LayoutWeb from "@/layouts/Web";
import { publicService } from "@/services/publicService";
import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import formatDate from "@/utils/Date";
import SEO from "@/components/general/SEO";
import ContentRenderer from "@/components/general/ContentRenderer";
import Loader from "@/components/general/Loader";

type Project = {
  title: string;
  description?: string;
  caption?: string;
  image?: string;
  link?: string;
  created_at: string;
};

export default function ProjectShow() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  document.title = "Project | Portfolio";

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

      <div className="pt-6 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Article */}
          <article className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-5 sm:p-6 md:p-10">
                {/* Header */}
                <header className="mb-6">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-2">
                      <FaCalendarAlt />
                      {formatDate(new Date(project.created_at))}
                    </span>

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Visit Project <FaExternalLinkAlt className="text-xs" />
                      </a>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 text-gray-900 dark:text-gray-100">
                    {project.title}
                  </h1>
                </header>

                {/* Content */}
                <section
                  className="
                    mt-6 prose dark:prose-invert max-w-none break-words
                    [&_img]:max-w-full [&_img]:h-auto
                    [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre
                    [&_code]:break-words
                    [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto
                  "
                >
                  <ContentRenderer content={project.description || ""} />
                </section>

                {/* Image */}
                {project.image && (
                  <figure className="mt-8">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full max-h-[520px] object-cover rounded-xl shadow-sm"
                      loading="lazy"
                    />
                  </figure>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar / Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Navigation
                </h2>

                <Link
                  to="/projects"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 transition"
                >
                  ← Back to Projects
                </Link>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-blue-600 text-blue-600 dark:text-blue-400 py-2.5 text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                  >
                    Open Live Project <FaExternalLinkAlt className="ml-2 text-xs" />
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </LayoutWeb>
  );
}
