import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import hasAnyPermission from "@/utils/Permissions";
import Pagination from "@/components/general/Pagination";

import { MdPersonSearch } from "react-icons/md";
import { FaCirclePlus, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

import experienceService from "@/services/experienceService";
import type { Experience } from "@/types/experience";
import formatDateTime from "@/utils/Date";

type PaginationState = {
  current_page: number;
  per_page: number;
  total: number;
};

export default function ExperiencesIndex() {
  document.title = "Experiences - Admin";

  const navigate = useNavigate();

  // permission guard (frontend)
  const canView = hasAnyPermission(["experiences.index"]);
  const canCreate = hasAnyPermission(["experiences.create"]);
  const canEdit = hasAnyPermission(["experiences.edit"]);
  const canDelete = hasAnyPermission(["experiences.delete"]);

  // StrictMode guard: prevent double fetch on DEV
  const didFetchRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [keywords, setKeywords] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    current_page: 1,
    per_page: 10,
    total: 0,
  });

  const fetchData = async (pageNumber = 1, searchKeyword = ""): Promise<void> => {
    setLoading(true);

    try {
      const data = await experienceService.getAll(pageNumber, searchKeyword);

      setExperiences(data.data);
      setPagination({
        current_page: data.current_page,
        per_page: data.per_page,
        total: data.total,
      });
    } catch (err: unknown) {
      const error = err as any;
      const status: number | undefined = error?.response?.status;

      if (status === 403) {
        toast.error("You are not allowed to access Experiences.");
        navigate("/forbidden");
        return;
      }

      toast.error(error?.response?.data?.message || "Failed to fetch experiences");
    } finally {
      setLoading(false);
    }
  };

  // Guard route
  useEffect(() => {
    if (!canView) navigate("/forbidden");
  }, [canView, navigate]);

  // Initial fetch
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
      title: "Delete Experience?",
      message: "Are you sure you want to delete this experience?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            // optimistic UI
            setExperiences((prev) => prev.filter((x) => x.id !== id));

            try {
              await experienceService.delete(id);
              toast.success("Experience deleted");
              void fetchData(pagination.current_page, keywords);
            } catch (err: unknown) {
              const error = err as any;
              const status: number | undefined = error?.response?.status;

              if (status === 403) {
                toast.error("You are not allowed to delete experiences.");
              } else {
                toast.error(error?.response?.data?.message || "Failed to delete experience");
              }

              // rollback -> re-fetch
              void fetchData(pagination.current_page, keywords);
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
      <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        {/* Header */}
        <div className="border-b border-stroke px-4 py-4 sm:px-6 dark:border-strokedark">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center">
            {/* Title */}
            <h4 className="sm:col-span-4 text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
              Experiences List
            </h4>

            <div className="grid grid-cols-3 gap-4 sm:col-span-5 items-center">
              {/* Button */}
              <div className="flex justify-start">
                {canCreate && (
                  <Link
                    to="/admin/experiences/create"
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-meta-5 px-4 text-sm font-medium text-white hover:bg-opacity-90"
                  >
                    <FaCirclePlus className="mr-2 h-4 w-4" />
                    Add
                  </Link>
                )}
              </div>

              {/* Input */}
              <div className="col-span-2 relative w-full">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdPersonSearch className="h-5 w-5 text-gray-500" />
                </span>
                <input
                  type="text"
                  value={keywords}
                  onChange={handleSearch}
                  placeholder="Search experience..."
                  className="h-11 w-full rounded-lg border border-stroke bg-transparent pl-10 pr-3 text-sm
        text-slate-800 dark:text-white dark:border-strokedark
        focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="py-14 text-center text-sm text-gray-500 dark:text-gray-400">
              Loading experiences...
            </div>
          ) : (
            <>
              <div className="w-full overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
                <table className="min-w-[900px] w-full border-collapse">
                  <thead className="bg-gray-100 dark:bg-meta-4">
                    <tr className="text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <th className="w-[80px] border-b border-stroke px-4 py-3 text-center dark:border-strokedark">
                        No.
                      </th>
                      <th className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                        Name
                      </th>
                      <th className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                        Start
                      </th>
                      <th className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                        End
                      </th>
                      <th className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                        Image
                      </th>
                      <th className="w-[140px] border-b border-stroke px-4 py-3 text-center dark:border-strokedark">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm text-slate-700 dark:text-slate-200">
                    {experiences.length > 0 ? (
                      experiences.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                          <td className="border-b border-stroke px-4 py-3 text-center dark:border-strokedark">
                            {index + 1 + (pagination.current_page - 1) * pagination.per_page}
                          </td>

                          <td className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                            {item.name}
                          </td>

                          <td className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                            {formatDateTime(item.start_date)}
                          </td>

                          <td className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                            {formatDateTime(item.end_date)}
                          </td>

                          <td className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-500">No image</span>
                            )}
                          </td>

                          <td className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                            <div className="flex items-center justify-center gap-3">
                              {canEdit && (
                                <Link
                                  to={`/admin/experiences/edit/${item.id}`}
                                  className="inline-flex items-center justify-center rounded-md p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-white/10"
                                  title="Edit"
                                >
                                  <FaEdit />
                                </Link>
                              )}

                              {canDelete && (
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="inline-flex items-center justify-center rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-white/10"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-red-500 font-medium">
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                className="mt-4 flex justify-end"
                currentPage={pagination.current_page}
                totalCount={pagination.total}
                pageSize={pagination.per_page}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
}
