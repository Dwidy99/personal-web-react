import LayoutWeb from "../../../layouts/Web";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Api from "../../../services/Api";
import toast from "react-hot-toast";
import CardProjects from "../../../components/general/CardProjects";
import SEO from "../../../components/general/SEO";

export default function Index() {
  const [projects, setProjects] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  document.title = "Projects Dwi's | Blogs";

  // 🔹 Fetch Projects from API
  const fetchDataProjects = async () => {
    setFetchError(null);
    try {
      const response = await Api.get(`/api/public/projects`);
      setProjects(response.data.data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects. Please try again later.");
      setFetchError(true);
    }
  };

  useEffect(() => {
    fetchDataProjects();
  }, []);

  // 🔹 Helper: truncate description safely
  const truncateText = (text, maxLength = 155) => {
    if (!text) return "No description available.";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <LayoutWeb>
      <SEO />

      <div className="container">
        {/* 🔹 Header Section */}
        <div className="mt-16 lg:mx-22 xsm:mt-22.5">
          <h2 className="text-3xl font-bold text-gray-700">Projects</h2>
          <p className="tracking-tight mb-2 text-gray-500">
            A collection of my open-source projects, prototypes, and client
            collaborations.
          </p>
          <hr className="my-8 border-gray-200" />
        </div>

        {/* 🔹 Project Grid */}
        <div className="grid lg:mx-22 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {fetchError ? (
            <div className="col-span-full text-center text-red-500">
              Failed to load projects. Please check your connection and try
              again.
            </div>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <CardProjects
                key={project.id}
                image={project.image}
                title={project.title || "Untitled Project"}
                caption={project.caption}
                description={truncateText(project.description)}
                link={`/projects/${project.slug}`}
              >
                <p className="text-sm font-medium text-right text-blue-600 hover:underline">
                  <Link to={`/projects/${project.slug}`}>Learn more →</Link>
                </p>
              </CardProjects>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No projects available.
            </div>
          )}
        </div>
      </div>
    </LayoutWeb>
  );
}
