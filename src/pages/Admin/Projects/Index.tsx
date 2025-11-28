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
            // (optimistic update)
            setProjects((prev) => prev.filter((item) => item.id !== id));

            try {
              // API delete
              const res = await projectService.delete(id);

              toast.success(res.message || "Project deleted successfully");

              // (new state)
              setTimeout(() => {
                fetchData(pagination.currentPage ?? 1, keywords);
              }, 0);
            } catch (error: any) {
              toast.error(error?.response?.data?.message || "Failed to delete project");

              //  Restore data (opsional but best practice)
              fetchData(pagination.currentPage ?? 1, keywords);
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
      <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-4 sm:p-6 md:p-8">
        {/* ✅ Create Form */}
        {hasAnyPermissions(["projects.create"]) && (
          <div className="mb-6">
            <ProjectsCreate fetchData={fetchData} />
          </div>
        )}

        {/* ✅ Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
            Project Lists
          </h4>

          <div className="relative w-full sm:w-72 md:w-96">
            <MdPersonSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              value={keywords}
              onChange={handleSearch}
              placeholder="Search projects..."
              className="w-full bg-transparent pl-10 pr-4 py-2 text-sm sm:text-base text-slate-800 dark:text-white border border-stroke dark:border-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* ✅ Table Section (Desktop / Tablet) */}
        <div className="hidden sm:block overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
          <table className="w-full border-collapse text-sm text-center">
            <thead className="bg-gray-100 dark:bg-meta-4 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3 font-semibold border-b">No.</th>
                <th className="p-3 font-semibold border-b">Image</th>
                <th className="p-3 font-semibold border-b">Title</th>
                <th className="p-3 font-semibold border-b">Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <tr
                    key={project.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-boxdark-2 transition-colors"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      <img
                        src={project.image || "/no-image.png"}
                        alt={project.title}
                        className="w-12 h-12 rounded-md object-cover mx-auto"
                      />
                    </td>
                    <td className="p-3 text-slate-800 dark:text-gray-200">{project.title}</td>
                    <td className="p-3 space-x-3">
                      <Link
                        to={`/admin/projects/edit/${project.id}`}
                        className="inline-flex items-center justify-center rounded-md px-3 py-2 text-white bg-primary hover:bg-opacity-80"
                      >
                        <FaUserEdit />
                      </Link>

                      {hasAnyPermissions(["projects.delete"]) && (
                        <button
                          onClick={() => handleDelete(Number(project.id))}
                          className="inline-flex items-center justify-center rounded-md px-3 py-2 text-white bg-danger hover:bg-opacity-80"
                        >
                          <MdDeleteForever />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-red-500 font-semibold">
                    No Data Found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Card Layout (Mobile) */}
        <div className="grid sm:hidden gap-4">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <div
                key={project.id}
                className="rounded-lg border border-stroke dark:border-strokedark bg-white dark:bg-boxdark p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm"
              >
                <div className="flex-shrink-0">
                  <img
                    src={project.image || "/no-image.png"}
                    alt={project.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h5 className="font-semibold text-gray-800 dark:text-gray-200">
                    {project.title}
                  </h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Project #{index + 1}
                  </p>
                </div>
                <div className="flex justify-center gap-3 mt-3 sm:mt-0">
                  <Link
                    to={`/admin/projects/edit/${project.id}`}
                    className="inline-flex items-center justify-center rounded-md px-3 py-2 bg-primary text-white hover:bg-opacity-80"
                  >
                    <FaUserEdit />
                  </Link>
                  {hasAnyPermissions(["projects.delete"]) && (
                    <button
                      onClick={() => handleDelete(Number(project.id))}
                      className="inline-flex items-center justify-center rounded-md px-3 py-2 bg-danger text-white hover:bg-opacity-80"
                    >
                      <MdDeleteForever />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-red-500 font-semibold">No Data Found!</p>
          )}
        </div>

        {/* ✅ Pagination */}
        <div className="flex justify-center sm:justify-end mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalCount={pagination.total}
            pageSize={pagination.perPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </LayoutAdmin>
  );
}
