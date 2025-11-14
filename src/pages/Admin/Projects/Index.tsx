import { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import Pagination from "@/components/general/Pagination";
import type { Project } from "@/types/project";
import hasAnyPermissions from "@/utils/Permissions";
import ProjectsCreate from "./Create";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { projectService } from "@/services";

interface PaginationState {
  currentPage: number;
  perPage: number;
  total: number;
}

export default function ProjectsIndex() {
  document.title = "Projects - My Portfolio";

  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState("");

  const fetchData = async (page = 1, search = "") => {
    try {
      const { items, pagination: pageInfo } = await projectService.getAll(page, search);

      setProjects(items || []);
      setPagination({
        currentPage: pageInfo.current_page || 1,
        perPage: pageInfo.per_page || 10,
        total: pageInfo.total || 0,
      });
    } catch (error) {
      toast.error("Failed to load projects");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeywords(value);
    fetchData(1, value);
  };

  const handleDelete = (id: number | string) => {
    confirmAlert({
      title: "Delete Project?",
      message: "Are you sure you want to delete this project?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const res = await projectService.delete(id);
              toast.success(res.message || "Project deleted successfully");
              fetchData(pagination.currentPage, keywords);
            } catch (error: any) {
              toast.error(error.response?.data?.message || "Failed to delete project");
            }
          },
        },
        { label: "No", onClick: () => {} },
      ],
    });
  };

  const handlePageChange = (page: number) => {
    fetchData(page, keywords);
  };

  return (
    <LayoutAdmin>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {hasAnyPermissions(["projects.create"]) && <ProjectsCreate fetchData={fetchData} />}

        <h4 className="mt-6 mb-1 text-xl font-semibold text-black dark:text-white">
          Project Lists
        </h4>

        <div className="w-full my-4">
          <div className="relative">
            <input
              type="text"
              value={keywords}
              onChange={handleSearch}
              placeholder="Search projects..."
              className="w-full bg-transparent pl-10 pr-4 py-2 text-black dark:text-white border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="button" className="absolute left-0 top-1/2 -translate-y-1/2 p-2">
              <MdPersonSearch />
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-stroke dark:border-strokedark text-center">
              <thead>
                <tr className="bg-gray-200 dark:bg-meta-4">
                  <th className="py-4 px-4 font-semibold border">No.</th>
                  <th className="py-4 px-4 font-semibold border">Image</th>
                  <th className="py-4 px-4 font-semibold border">Title</th>
                  <th className="py-4 px-4 font-semibold border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <tr key={project.id} className="border-b border-stroke dark:border-strokedark">
                      <td className="py-4 border">{index + 1}</td>
                      <td className="py-4 border">
                        <img
                          src={project.image || "/no-image.png"}
                          alt={project.title}
                          className="w-12 h-12 object-cover rounded-md mx-auto"
                        />
                      </td>
                      <td className="py-4 border">{project.title}</td>
                      <td className="py-4 border space-x-3">
                        <Link
                          to={`/admin/projects/edit/${project.id}`}
                          className="inline-flex items-center justify-center rounded-md py-2 px-4 font-medium text-white bg-primary hover:bg-opacity-80"
                        >
                          <FaUserEdit className="text-xl" />
                        </Link>

                        {hasAnyPermissions(["projects.delete"]) && (
                          <button
                            onClick={() => handleDelete(Number(project.id))}
                            className="inline-flex items-center justify-center rounded-md py-2 px-4 font-medium text-white bg-danger hover:bg-opacity-80"
                          >
                            <MdDeleteForever className="text-xl" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-5 text-center text-red-500 font-semibold">
                      No Data Found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          className="flex justify-end my-4"
          currentPage={pagination.currentPage}
          totalCount={pagination.total}
          pageSize={pagination.perPage}
          onPageChange={handlePageChange}
        />
      </div>
    </LayoutAdmin>
  );
}
