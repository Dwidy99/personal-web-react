import { useEffect, useState, useCallback } from "react";
import LayoutWeb from "../../../layouts/Web";
import Api from "../../../services/Api";
import { Link, useParams } from "react-router-dom";
import LoadingTailwind from "../../../components/general/LoadingTailwind";
import { FaCalendarAlt } from "react-icons/fa";
import DateID from "../../../utils/DateID";
import SEO from "../../../components/general/SEO";
import ContentRenderer from "../../../components/general/SanitizedHTML"; // Assuming this is your custom component

export default function Show() {
  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const { slug } = useParams();

  document.title = "Show Project Dwi's | Blogs";

  const fetchDetailDataProject = useCallback(async () => {
    try {
      setLoadingProject(true);
      const response = await Api.get(`/api/public/projects/${slug}`);

      console.log(response);

      setProject(response.data.data || null);
    } catch (error) {
      setProject(error);
    } finally {
      setLoadingProject(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchDetailDataProject();
  }, [slug, fetchDetailDataProject]);

  if (loadingProject) {
    return (
      <LayoutWeb>
        <div className="container">
          <LoadingTailwind />
        </div>
      </LayoutWeb>
    );
  }

  if (!project) {
    return (
      <LayoutWeb>
        <div className="container text-center py-20">
          <h1 className="text-2xl font-bold text-red-500">Project not found</h1>
          <Link
            to="/blog"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Back to Blog
          </Link>
        </div>
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb disableSnow>
      <SEO
        title={project.title}
        description={project.excerpt}
        keywords={project.tags?.join(",")}
      />
      <div className="container mx-auto px-4 mt-22.5 sm:px-6 md:px-8">
        {" "}
        {/* Adjusted container to mx-auto and added px-4 */}
        <div className="justify-center m-18">
          <div className="lg:col-span-2">
            <div className="rounded-lg shadow-lg p-6 bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {" "}
              {/* Adjusted for dark mode background/text */}
              <div className="flex justify-start mt-2">
                <span className="ml-5 text-gray-600 dark:text-gray-400">
                  {" "}
                  {/* Adjusted for dark mode text */}
                  <FaCalendarAlt className="inline mr-2" />
                  {DateID(new Date(project.created_at))}
                </span>
              </div>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-800 dark:text-gray-100 sm:text-5xl">
                {" "}
                {/* Adjusted for dark mode text */}
                {project.title}
              </h1>
              <hr className="border-gray-300 dark:border-gray-700 my-4" />{" "}
              {/* Adjusted for dark mode border */}
              <div className="mt-6 text-gray-800 dark:text-gray-300">
                {" "}
                {/* Adjusted for dark mode text */}
                <ContentRenderer
                  content={project.description}
                  className="custom-styles" // Remove dark:text-gray-600 here, let the ContentRenderer handle its internal styles or let the parent div dictate it.
                  isQuillContent={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWeb>
  );
}
