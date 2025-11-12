import { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import hasAnyPermissions from "../../../utils/Permissions";
import Api from "../../../services/Api";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import Pagination from "../../../components/general/Pagination";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";

interface Category {
  id: number;
  name: string;
  image: string;
}

interface PaginationState {
  currentPage: number;
  perPage: number;
  total: number;
}

export default function CategoriesIndex() {
  document.title = "Categories - Desa Digital";

  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState("");

  const token = Cookies.get("token");

  const fetchData = async (pageNumber = 1, search = "") => {
    if (!token) return;

    try {
      const res = await Api.get(`/api/admin/categories?search=${search}&page=${pageNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data;
      setCategories(data.data);
      setPagination({
        currentPage: data.current_page,
        perPage: data.per_page,
        total: data.total,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchData = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeywords(value);
    fetchData(1, value);
  };

  const deleteCategory = (id: number) => {
    confirmAlert({
      title: "Are you sure?",
      message: "Want to delete this data?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            if (!token) return;
            try {
              const res = await Api.delete(`/api/admin/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              toast.success(res.data.message, { position: "top-center" });
              fetchData();
            } catch (err) {
              console.error(err);
            }
          },
        },
        { label: "NO", onClick: () => {} },
      ],
    });
  };

  const handlePageChange = (pageNumber: number) => fetchData(pageNumber, keywords);

  return (
    <LayoutAdmin>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Categories List</h4>

        <div className="flex flex-row mb-4">
          <div className="w-full basis-1/4 sm:w-auto">
            {hasAnyPermissions(["categories.create"]) && (
              <Link
                to="/admin/categories/create"
                className="mx-2 inline-flex items-center justify-center rounded-md bg-meta-5 py-3.5 px-2 text-center font-medium text-white hover:bg-opacity-90 sm:text-xs"
              >
                <FaCirclePlus className="text-white mr-2" /> Add New
              </Link>
            )}
          </div>

          <div className="w-full basis-2/2">
            <div className="relative">
              <input
                type="text"
                onChange={searchData}
                placeholder="Search here..."
                className="w-full bg-transparent pl-10 pr-4 py-2 text-black dark:text-white border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="button" className="absolute left-0 top-1/2 -translate-y-1/2 p-2">
                <MdPersonSearch />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full text-center border border-stroke dark:border-strokedark">
              <thead>
                <tr className="bg-gray-200 dark:bg-meta-4">
                  <th className="py-4 px-4 dark:text-white">No.</th>
                  <th className="py-4 px-4 dark:text-white">Category Name</th>
                  <th className="py-4 px-4 dark:text-white">Icon</th>
                  <th className="py-4 px-4 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat, index) => (
                    <tr key={cat.id} className="border-b border-stroke dark:border-strokedark">
                      <td className="py-4 px-4 dark:text-white">{index + 1}</td>
                      <td className="py-4 px-4 dark:text-white">{cat.name}</td>
                      <td className="py-4 px-4">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-12 h-12 object-cover rounded-full mx-auto"
                        />
                      </td>
                      <td className="flex justify-center p-2.5 gap-2">
                        <Link to={`/admin/categories/edit/${cat.id}`} className="inline-flex">
                          <FaUserEdit className="text-xl text-primary" />
                        </Link>
                        {hasAnyPermissions(["categories.delete"]) && (
                          <button onClick={() => deleteCategory(cat.id)} className="inline-flex">
                            <MdDeleteForever className="text-xl text-danger" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-5 text-center text-lg font-semibold text-red-500">
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
