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

// Service
import { categoryService } from "../../../services/categoryService";

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
            await categoryService.delete(id);
            toast.success("Category deleted successfully!");
            fetchData(pagination.current_page);
          },
        },
        { label: "NO" },
      ],
    });
  };

  return (
    <LayoutAdmin>
      <div className="rounded-lg border bg-white p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold">Category List</h4>
          {hasAnyPermissions(["categories.create"]) && (
            <Link
              to="/admin/categories/create"
              className="inline-flex items-center rounded-md bg-primary text-white py-2 px-4 hover:bg-opacity-90"
            >
              <FaCirclePlus className="mr-2" /> Add New
            </Link>
          )}
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            value={keywords}
            onChange={searchData}
            placeholder="Search categories..."
            className="w-full border rounded-md p-2 pl-10"
          />
          <MdPersonSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>

        <table className="w-full border border-stroke rounded-md text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-2">No.</th>
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2">Icon</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat, i) => (
                <tr key={cat.id} className="border-t">
                  <td>{i + 1}</td>
                  <td>{cat.name}</td>
                  <td>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-12 h-12 mx-auto rounded-full"
                    />
                  </td>
                  <td className="flex justify-center gap-2 py-2">
                    <Link to={`/admin/categories/edit/${cat.id}`}>
                      <FaUserEdit className="text-primary text-lg" />
                    </Link>
                    {hasAnyPermissions(["categories.delete"]) && (
                      <button onClick={() => handleDelete(cat.id)}>
                        <MdDeleteForever className="text-danger text-lg" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-red-500 font-medium">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          className="flex justify-end mt-4"
          currentPage={pagination.current_page}
          totalCount={pagination.total}
          pageSize={pagination.per_page}
          onPageChange={(page) => fetchData(page, keywords)}
        />
      </div>
    </LayoutAdmin>
  );
}
