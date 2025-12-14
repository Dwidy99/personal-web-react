import { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import { Category, PaginationMeta } from "../../../types/category";
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

  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState("");

  const fetchData = async (page = 1, search = "") => {
    const data = await categoryService.getAll(page, search);
    setCategories(data.data);
    setPagination({
      current_page: data.current_page,
      per_page: data.per_page,
      total: data.total,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchData = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeywords(value);
    fetchData(1, value);
  };

  const handleDelete = (id: number) => {
    confirmAlert({
      title: "Are you sure?",
      message: "Want to delete this data?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            // Optimistic UI
            setCategories((prev) => prev.filter((c) => c.id !== id));

            try {
              await categoryService.delete(id);
              toast.success("Category deleted successfully!");
              fetchData(pagination.current_page, keywords);
            } catch (err: any) {
              toast.error(err?.response?.data?.message || "Failed to delete category");
              fetchData(pagination.current_page, keywords);
            }
          },
        },
        { label: "NO" },
      ],
    });
  };

  return (
    <LayoutAdmin>
      <div className="rounded-lg border border-stroke bg-white shadow-sm p-4 sm:p-6 dark:border-strokedark dark:bg-boxdark">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">
            Category List
          </h4>

          {hasAnyPermissions(["categories.create"]) && (
            <Link
              to="/admin/categories/create"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-primary text-white py-2 px-4 hover:bg-opacity-90"
            >
              <FaCirclePlus className="mr-2" /> Add New
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <MdPersonSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={keywords}
            onChange={searchData}
            placeholder="Search categories..."
            className="w-full border border-stroke rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-transparent dark:text-white dark:border-strokedark"
          />
        </div>

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
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-10 h-10 mx-auto rounded-full object-cover"
                      />
                    </td>

                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/categories/edit/${cat.id}`}
                          className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-white hover:bg-opacity-90"
                          title="Edit"
                        >
                          <FaUserEdit />
                        </Link>

                        {hasAnyPermissions(["categories.delete"]) && (
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
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

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

                  {hasAnyPermissions(["categories.delete"]) && (
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
            onPageChange={(page) => fetchData(page, keywords)}
          />
        </div>
      </div>
    </LayoutAdmin>
  );
}
