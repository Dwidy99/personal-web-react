// src/pages/Admin/Projects/Index.tsx
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import Pagination from "@/components/general/Pagination";
import type { Project } from "@/types/project";
import hasAnyPermissions from "@/utils/Permissions";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { projectService } from "@/services";

type PaginationState = {
  currentPage: number;
  perPage: number;
  total: number;
};

export default function ProjectsIndex() {
  document.title = "Projects - My Portfolio";

  const navigate = useNavigate();

  // permissions
  const canView = hasAnyPermissions(["projects.index"]);
  const canCreate = hasAnyPermissions(["projects.create"]);
  const canDelete = hasAnyPermissions(["projects.delete"]);

  // StrictMode guard (DEV) biar tidak double fetch
  const didFetchRef = useRef(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async (page = 1, search = ""): Promise<void> => {
    setLoading(true);
    try {
      const { items, pagination: pageInfo } = await projectService.getAll(page, search);

      setProjects(items);
      setPagination({
        currentPage: pageInfo.current_page,
        perPage: pageInfo.per_page,
        total: pageInfo.total,
      });
    } catch (error: any) {
      const status = error?.response?.status;

      // kalau forbidden, jangan bikin uncaught
      if (status === 403) {
        toast.error("You are not allowed to access Projects.");
        navigate("/forbidden"); // atau "/admin/dashboard"
        return;
      }

      toast.error(error?.response?.data?.message || "Failed to load projects");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // guard akses page via URL
  useEffect(() => {
    if (!canView) navigate("/forbidden");
  }, [canView, navigate]);

  // initial fetch hanya kalau canView
  useEffect(() => {
    if (!canView) return;
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    void fetchData(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeywords(value);
    void fetchData(1, value);
  };

  const handleDelete = (id: number | string) => {
    confirmAlert({
      title: "Delete Project?",
      message: "Are you sure you want to delete this project?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            // optimistic UI
            setProjects((prev) => prev.filter((item) => item.id !== id));

            try {
              const res = await projectService.delete(id);
              toast.success(res.message || "Project deleted successfully");
              void fetchData(pagination.currentPage, keywords);
            } catch (error: any) {
              const status = error?.response?.status;

              if (status === 403) {
                toast.error("You are not allowed to delete projects.");
                void fetchData(pagination.currentPage, keywords);
                return;
              }

              toast.error(error?.response?.data?.message || "Failed to delete project");
              void fetchData(pagination.currentPage, keywords);
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  const handlePageChange = (page: number) => {
    void fetchData(page, keywords);
  };

  return (
    <LayoutAdmin>
      <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center">
          <h4 className="sm:col-span-4 text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
            Project Lists
          </h4>

          <div className="grid grid-cols-1 gap-3 sm:col-span-8 sm:grid-cols-12 sm:items-center">
            {/* Add button */}
            <div className="sm:col-span-4 flex justify-start sm:justify-end">
              {canCreate && (
                <Link
                  to="/admin/projects/create"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-opacity-90"
                >
                  <FaCirclePlus className="mr-2 h-4 w-4" />
                  Add Project
                </Link>
              )}
            </div>

            {/* Search */}
            <div className="sm:col-span-8">
              <div className="relative w-full">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdPersonSearch className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </span>
                <input
                  type="text"
                  value={keywords}
                  onChange={handleSearch}
                  placeholder="Search projects..."
                  className="h-11 w-full rounded-lg border border-stroke bg-transparent pl-10 pr-3 text-sm
                             text-slate-800 dark:text-white dark:border-strokedark
                             focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="py-14 text-center text-sm text-gray-500 dark:text-gray-400">
            Loading projects...
          </div>
        ) : (
          <>
            {/* Table (sm+) */}
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
                            title="Edit"
                          >
                            <FaUserEdit />
                          </Link>

                          {canDelete && (
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-white bg-danger hover:bg-opacity-80"
                              title="Delete"
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

            {/* Cards (mobile) */}
            <div className="grid sm:hidden gap-4">
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="rounded-lg border border-stroke dark:border-strokedark bg-white dark:bg-boxdark p-4 flex flex-col gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={project.image || "/no-image.png"}
                        alt={project.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 dark:text-gray-200">
                          {project.title}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Project #{index + 1}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin/projects/edit/${project.id}`}
                        className="inline-flex items-center justify-center rounded-md px-3 py-2 bg-primary text-white hover:bg-opacity-80"
                        title="Edit"
                      >
                        <FaUserEdit />
                      </Link>

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="inline-flex items-center justify-center rounded-md px-3 py-2 bg-danger text-white hover:bg-opacity-80"
                          title="Delete"
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

            {/* Pagination */}
            <div className="flex justify-center sm:justify-end mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalCount={pagination.total}
                pageSize={pagination.perPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </LayoutAdmin>
  );
}
