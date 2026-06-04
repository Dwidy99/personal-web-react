import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import LayoutWeb from "@/layouts/Web";
import SEO from "@/components/general/SEO";
import Loading from "@/components/web/Loading";
import { publicWebApi } from "@/features/web/shared/api/publicWebApi";
import WebContentCard from "@/features/web/shared/components/WebContentCard";
import type { WebProject } from "@/features/web/shared/types";

export default function ProjectsIndex() {
  const [projects, setProjects] = useState<WebProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  document.title = "Projects | Portfolio";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await publicWebApi.getProjects();
        setProjects(data || []);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load projects";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <LayoutWeb>
        <SEO
          title="Projects | Portfolio"
          description="Selected projects, prototypes, and portfolio work."
        />
        <Loading message="Loading projects..." variant="section" className="mt-24 min-h-[18rem]" />
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb>
      <SEO
        title="Projects | Portfolio"
        description="Selected projects, prototypes, and portfolio work."
      />

      <header className="mx-auto max-w-3xl pt-10 text-center sm:pt-12 lg:pt-14">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-5xl">Projects</h1>
        <span className="mt-4 inline-flex rounded-full border border-sky-300 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase text-sky-700 shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-white">
          Selected Work
        </span>
        <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
          A curated collection of projects, prototypes, and experiments. Each card keeps the preview
          short so the full story can breathe on the detail page.
        </p>
      </header>

      <section className="mt-12">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              const detailPath = project.slug ? `/projects/${project.slug}` : "/projects";

              return (
                <WebContentCard
                  key={project.id ?? project.slug ?? index}
                  image={project.image}
                  title={project.title}
                  eyebrow={project.caption}
                  description={project.description || project.caption}
                  link={detailPath}
                >
                  <Link
                    to={detailPath}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-900 transition hover:border-sky-300 hover:text-sky-600 dark:border-gray-700 dark:text-white dark:hover:border-sky-400 dark:hover:text-sky-300"
                  >
                    Read project detail <FaArrowRight className="text-xs" />
                  </Link>
                </WebContentCard>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            No projects available.
          </div>
        )}
      </section>
    </LayoutWeb>
  );
}
