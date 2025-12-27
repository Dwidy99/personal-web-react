import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import type { Category, PaginationMeta } from "../../../types/category";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import Pagination from "../../../components/general/Pagination";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import hasAnyPermissions from "../../../utils/Permissions";
import { categoryService } from "../../../services";

export default function CategoriesIndex() {
  document.title = "Categories - Desa Digital";

  const navigate = useNavigate();

  // ✅ Permission (frontend guard)
  const canView = hasAnyPermissions(["categories.index"]);
  const canCreate = hasAnyPermissions(["categories.create"]);
  const canDelete = hasAnyPermissions(["categories.delete"]);
  const canEdit = hasAnyPermissions(["categories.edit"]); // kalau ada, opsional

  // ✅ StrictMode guard (DEV): cegah double fetch
  const didFetchRef = useRef(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async (page = 1, search = ""): Promise<void> => {
    // ✅ jangan fetch kalau tidak punya akses
    if (!canView) return;

    setLoading(true);
    try {
      const data = await categoryService.getAll(page, search);

      setCategories(data.data);
      setPagination({
        current_page: data.current_page,
        per_page: data.per_page,
        total: data.total,
      });
    } catch (err: unknown) {
      const error = err as any;
      const status = error?.response?.status;

      if (status === 403) {
        toast.error("You are not allowed to access Categories.");
        navigate("/forbidden"); // atau "/admin/dashboard"
        return;
      }

      toast.error(error?.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Guard route: kalau user buka URL langsung
  useEffect(() => {
    if (!canView) {
      navigate("/forbidden"); // atau "/admin/dashboard"
    }
  }, [canView, navigate]);

  // ✅ Initial fetch sekali saja
  useEffect(() => {
    if (!canView) return;
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    void fetchData(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView]);

  const searchData = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeywords(value);
    void fetchData(1, value);
  };

  const handleDelete = (id: number) => {
    confirmAlert({
      title: "Are you sure?",
      message: "Want to delete this data?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            // optimistic
            setCategories((prev) => prev.filter((c) => c.id !== id));

            try {
              await categoryService.delete(id);
              toast.success("Category deleted successfully!");
              void fetchData(pagination.current_page, keywords);
            } catch (err: unknown) {
              const error = err as any;
              const status = error?.response?.status;

              if (status === 403) {
                toast.error("You are not allowed to delete categories.");
                void fetchData(pagination.current_page, keywords);
                return;
              }

              toast.error(error?.response?.data?.message || "Failed to delete category");
              void fetchData(pagination.current_page, keywords);
            }
          },
        },
        { label: "NO" },
      ],
    });
  };

  return (
    <LayoutAdmin>
      <div className="border-b border-stroke px-4 py-4 sm:px-6 dark:border-strokedark">
        <div className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-12 sm:items-center">
          {/* Title */}
          <h4 className="sm:col-span-4 text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
            Categories List
          </h4>

          {/* Right side controls */}
          <div className="grid grid-cols-3 gap-4 sm:col-span-5 items-center">
            {/* Button */}
            <div className="flex justify-start">
              {canCreate && (
                <Link
                  to="/admin/categories/create"
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
                onChange={searchData} // atau handleSearch kalau nama fungsinya itu
                placeholder="Search category..."
                className="h-11 w-full rounded-lg border border-stroke bg-transparent pl-10 pr-3 text-sm
            text-slate-800 dark:text-white dark:border-strokedark
            focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            Loading categories...
          </div>
        ) : (
          <>
            {/* Desktop/Tablet Table */}
            <div className="hidden sm:block overflow-x-auto rounded-md border border-stroke dark:border-strokedark">
              <table className="w-full min-w-[600px] text-sm">
                <thead className="bg-gray-100 dark:bg-meta-4">
                  <tr>
                    <th className="p-3 text-center font-semibold border-b border-stroke dark:border-strokedark">
                      No.
                    </th>
                    <th className="p-3 text-left font-semibold border-b border-stroke dark:border-strokedark">
                      Name
                    </th>
                    <th className="p-3 text-center font-semibold border-b border-stroke dark:border-strokedark">
                      Icon
                    </th>
                    <th className="p-3 text-center font-semibold border-b border-stroke dark:border-strokedark">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categories.length > 0 ? (
                    categories.map((cat, i) => (
                      <tr
                        key={cat.id}
                        className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-boxdark-2 transition"
                      >
                        <td className="p-3 text-center">
                          {i + 1 + (pagination.current_page - 1) * pagination.per_page}
                        </td>

                        <td className="p-3 text-left font-medium text-slate-800 dark:text-white">
                          {cat.name}
                        </td>

                        <td className="p-3">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-10 h-10 mx-auto rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">No image</span>
                          )}
                        </td>

                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            {(canEdit || true) && (
                              <Link
                                to={`/admin/categories/edit/${cat.id}`}
                                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-white hover:bg-opacity-90"
                                title="Edit"
                              >
                                <FaUserEdit />
                              </Link>
                            )}

                            {canDelete && (
                              <button
                                onClick={() => handleDelete(cat.id)}
                                className="inline-flex items-center justify-center rounded-md bg-danger px-3 py-2 text-white hover:bg-opacity-90"
                                title="Delete"
                              >
                                <MdDeleteForever />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-red-500 font-medium">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid sm:hidden gap-3">
              {categories.length > 0 ? (
                categories.map((cat, i) => (
                  <div
                    key={cat.id}
                    className="rounded-lg border border-stroke dark:border-strokedark bg-white dark:bg-boxdark p-4 flex items-center gap-3"
                  >
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full border border-dashed border-stroke dark:border-strokedark flex items-center justify-center text-[10px] text-gray-500">
                        No image
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        #{i + 1 + (pagination.current_page - 1) * pagination.per_page}
                      </p>
                      <h5 className="font-semibold text-slate-800 dark:text-white">{cat.name}</h5>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/categories/edit/${cat.id}`}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-white"
                      >
                        <FaUserEdit />
                      </Link>

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="inline-flex items-center justify-center rounded-md bg-danger px-3 py-2 text-white"
                        >
                          <MdDeleteForever />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-red-500 font-medium py-6">No Data Found</p>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center sm:justify-end mt-6">
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
    </LayoutAdmin>
  );
}
