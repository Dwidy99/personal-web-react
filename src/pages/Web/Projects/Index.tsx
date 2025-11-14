import { useEffect, useState } from "react";
import LayoutWeb from "../../../layouts/Web";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import CardProjects from "../../../components/general/CardProjects";
import SEO from "../../../components/general/SEO";
import LoadingTailwind from "../../../components/general/LoadingTailwind";

// Service
import { publicService } from "../../../services/";

export default function ProjectsIndex() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  document.title = "Projects | Portfolio Blogs";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await publicService.getProjects();
        setProjects(data);
      } catch (err: any) {
        setError(err.message || "Failed to load projects");
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const truncateText = (text?: string, maxLength = 155): string => {
    if (!text) return "No description available.";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <LayoutWeb>
      <SEO />
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 xl:px-20 py-10 md:py-16">
        {/* Header */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">
            My Projects
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
            A collection of my open-source works, prototypes, and client collaborations.
          </p>
          <hr className="mt-6 border-gray-200 dark:border-gray-700" />
        </header>

        {/* Projects Grid */}
        {loading ? (
          <LoadingTailwind />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, i) => (
              <CardProjects
                key={i}
                image={project.image}
                title={project.title}
                caption={project.caption}
                description={truncateText(project.description)}
                link={project.link}
              >
                <p className="text-sm font-medium text-right text-blue-600 hover:underline mt-2">
                  <Link to={`/projects/${project.slug}`}>Learn more →</Link>
                </p>
              </CardProjects>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No projects available.
          </p>
        )}
      </section>
    </LayoutWeb>
  );
}
