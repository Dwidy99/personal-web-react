import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { FaCirclePlus, FaTrash } from "react-icons/fa6";
import { MdPersonSearch } from "react-icons/md";
import LayoutAdmin from "@/layouts/Admin";
import Pagination from "@/components/general/Pagination";
import Loading from "@/components/admin/Loading";
import hasAnyPermission from "@/utils/Permissions";
import experienceService from "@/services/experienceService";
import formatDateTime from "@/utils/Date";
import type {
  AdminExperience,
  AdminExperiencePagination,
} from "@/features/admin/experiences/types";
import {
  getErrorMessage,
  getHttpStatus,
} from "@/features/admin/shared/utils/apiError";

export default function ExperiencesIndex() {
  document.title = "Experiences - Admin";

  const navigate = useNavigate();

  const canView = hasAnyPermission(["experiences.index"]);
  const canCreate = hasAnyPermission(["experiences.store"]);
  const canEdit = hasAnyPermission(["experiences.update"]);
  const canDelete = hasAnyPermission(["experiences.delete"]);

  const [experiences, setExperiences] = useState<AdminExperience[]>([]);
  const [pagination, setPagination] = useState<AdminExperiencePagination>({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (page = 1, search = ""): Promise<void> => {
    if (!canView) return;

    setLoading(true);

    try {
      const data = await experienceService.getAll(page, search);

      setExperiences(data.data);
      setPagination({
        current_page: data.current_page,
        per_page: data.per_page,
        total: data.total,
      });
    } catch (error: unknown) {
      if (getHttpStatus(error) === 403) {
        toast.error("You are not allowed to access Experiences.");
        navigate("/forbidden");
        return;
      }

      toast.error(getErrorMessage(error, "Failed to fetch experiences"));
    } finally {
      setLoading(false);
    }
  }, [canView, navigate]);

  useEffect(() => {
    if (!canView) navigate("/forbidden");
  }, [canView, navigate]);

  useEffect(() => {
    if (!canView) return;

    void fetchData(1, "");
  }, [canView, fetchData]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeywords(value);
    void fetchData(1, value);
  };

  const handleDelete = (id: number) => {
    confirmAlert({
      title: "Delete Experience?",
      message: "Are you sure you want to delete this experience?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            setExperiences((prev) => prev.filter((item) => item.id !== id));

            try {
              await experienceService.delete(id);
              toast.success("Experience deleted successfully.");
              void fetchData(pagination.current_page, keywords);
            } catch (error: unknown) {
              if (getHttpStatus(error) === 403) {
                toast.error("You are not allowed to delete experiences.");
                void fetchData(pagination.current_page, keywords);
                return;
              }

              toast.error(getErrorMessage(error, "Failed to delete experience"));
              void fetchData(pagination.current_page, keywords);
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  return (
    <LayoutAdmin>
      <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6">
          <div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl">
              Experiences List
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage career entries, timeline dates, images, and descriptions.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              {canCreate && (
                <Link
                  to="/admin/experiences/create"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-meta-5 px-4 text-sm font-medium text-white transition hover:bg-opacity-90"
                >
                  <FaCirclePlus className="mr-2 h-4 w-4" />
                  Add
                </Link>
              )}

              <div className="relative w-full sm:w-[320px]">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdPersonSearch className="h-5 w-5 text-gray-500" />
                </span>
                <input
                  type="text"
                  value={keywords}
                  onChange={handleSearch}
                  placeholder="Search experience..."
                  className="h-11 w-full rounded-lg border border-stroke bg-transparent pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-primary dark:border-strokedark dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {loading ? (
            <Loading message="Loading experiences..." variant="page" className="py-14" />
          ) : (
            <>
              <div className="hidden overflow-x-auto rounded-lg border border-stroke dark:border-strokedark sm:block">
                <table className="w-full min-w-[900px] border-collapse text-sm">
                  <thead className="bg-gray-100 dark:bg-meta-4">
                    <tr className="text-left font-semibold text-slate-700 dark:text-slate-200">
                      <th className="w-[80px] border-b border-stroke px-4 py-3 text-center dark:border-strokedark">
                        No.
                      </th>
                      <th className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                        Experience
                      </th>
                      <th className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                        Start
                      </th>
                      <th className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                        End
                      </th>
                      <th className="border-b border-stroke px-4 py-3 text-center dark:border-strokedark">
                        Image
                      </th>
                      <th className="w-[140px] border-b border-stroke px-4 py-3 text-center dark:border-strokedark">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-slate-700 dark:text-slate-200">
                    {experiences.length > 0 ? (
                      experiences.map((item, index) => (
                        <tr
                          key={item.id}
                          className="transition hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <td className="border-b border-stroke px-4 py-3 text-center dark:border-strokedark">
                            {index + 1 + (pagination.current_page - 1) * pagination.per_page}
                          </td>

                          <td className="border-b border-stroke px-4 py-3 font-medium text-slate-800 dark:border-strokedark dark:text-white">
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
                                className="mx-auto h-11 w-11 rounded-lg object-contain"
                              />
                            ) : (
                              <span className="block text-center text-xs text-gray-500">
                                No image
                              </span>
                            )}
                          </td>

                          <td className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                            <div className="flex items-center justify-center gap-2">
                              {canEdit && (
                                <Link
                                  to={`/admin/experiences/edit/${item.id}`}
                                  className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-white transition hover:bg-opacity-90"
                                  title="Edit"
                                >
                                  <FaEdit />
                                </Link>
                              )}

                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.id)}
                                  className="inline-flex items-center justify-center rounded-md bg-danger px-3 py-2 text-white transition hover:bg-opacity-90"
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
                        <td colSpan={6} className="px-4 py-10 text-center font-medium text-red-500">
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 sm:hidden">
                {experiences.length > 0 ? (
                  experiences.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-lg object-contain"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-stroke text-[10px] text-gray-500 dark:border-strokedark">
                          No image
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          #{index + 1 + (pagination.current_page - 1) * pagination.per_page}
                        </p>
                        <h5 className="truncate font-semibold text-slate-800 dark:text-white">
                          {item.name}
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(item.start_date)} - {formatDateTime(item.end_date)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {canEdit && (
                          <Link
                            to={`/admin/experiences/edit/${item.id}`}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-white"
                          >
                            <FaEdit />
                          </Link>
                        )}

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center justify-center rounded-md bg-danger px-3 py-2 text-white"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center font-medium text-red-500">No Data Found</p>
                )}
              </div>

              <div className="mt-6 flex justify-center sm:justify-end">
                <Pagination
                  currentPage={pagination.current_page}
                  totalCount={pagination.total}
                  pageSize={pagination.per_page}
                  onPageChange={(page) => void fetchData(page, keywords)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
}
