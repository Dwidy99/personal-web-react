import { useEffect, useState } from "react";
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

export default function CategoriesIndex() {
  document.title = "Categories - Desa Digital";

  // State for categories and pagination
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState("");

  // Get token from cookies
  const token = Cookies.get("token");

  // Function to fetch categories data
  const fetchData = async (pageNumber = 1, keywords = "") => {
    const page = pageNumber ? pageNumber : pagination.currentPage;

    await Api.get(`/api/admin/categories?search=${keywords}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setCategories(response.data.data.data);
      setPagination({
        currentPage: response.data.data.current_page,
        perPage: response.data.data.per_page,
        total: response.data.data.total,
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function for search input
  const searchData = async (e) => {
    setKeywords(e.target.value);
    fetchData(1, e.target.value);
  };

  // Function to delete a category
  const deleteCategory = (id) => {
    confirmAlert({
      title: "Are you sure?",
      message: "Want to delete this data?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            await Api.delete(`/api/admin/categories/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then((response) => {
              toast.success(response.data.message, { position: "top-center" });
              fetchData();
            });
          },
        },
        {
          label: "NO",
          onClick: () => {},
        },
      ],
    });
  };

  // Pagination Handler
  const handlePageChange = (pageNumber) => {
    fetchData(pageNumber, keywords);
  };

  return (
    <LayoutAdmin>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default lg:dark:bg-meta-4 sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Categories List
        </h4>

        <div className="flex flex-row mb-4">
          <div className="w-full basis-1/4 sm:w-auto">
            {hasAnyPermissions(["categories.create"]) && (
              <Link
                to="/admin/categories/create"
                className="mx-2 inline-flex items-center justify-center rounded-md bg-meta-5 py-3.5 px-2 text-center font-medium text-white hover:bg-opacity-90 sm:text-xs"
                type="button"
              >
                <FaCirclePlus className="text-white mr-2" /> Add New
              </Link>
            )}
          </div>

          <div className="w-full basis-2/2">
            <form action="#" method="POST">
              <div className="relative">
                <input
                  type="text"
                  onChange={(e) => searchData(e)}
                  placeholder="Search here..."
                  className="w-full bg-transparent pl-10 pr-4 py-2 text-black dark:text-white border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2"
                >
                  <MdPersonSearch />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full text-center items-center table-auto border-collapse border border-stroke dark:border-strokedark">
              <thead>
                <tr className="bg-gray-200 dark:bg-meta-4">
                  <th className="min-w-[115px] py-4 px-4 dark:text-white">
                    No.
                  </th>
                  <th className="min-w-[115px] py-4 px-4 dark:text-white">
                    Categories Name
                  </th>
                  <th className="min-w-[115px] py-4 px-4 dark:text-white">
                    Icon
                  </th>
                  <th className="min-w-[115px] py-4 px-4 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <tr
                      className={`${index === categories.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
                      key={category.id}
                    >
                      <td className="py-5 px-4 pl-9 border border-stroke dark:border-strokedark xl:pl-11">
                        <h5 className="dark:text-white">{index + 1}</h5>
                      </td>
                      <td className="py-5 px-4 pl-9 border border-stroke dark:border-strokedark xl:pl-11">
                        <h5 className="dark:text-white">{category.name}</h5>
                      </td>
                      <td className="py-5 px-4 pl-9 border border-stroke dark:border-strokedark xl:pl-11">
                        <h5 className="dark:text-white">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-12 h-12 object-cover rounded-full mx-auto"
                          />
                        </h5>
                      </td>
                      <td className="flex justify-center p-2.5 xl:p-5 gap-2">
                        <Link
                          to={`/admin/categories/edit/${category.id}`}
                          className="inline-flex rounded-md py-2 px-4 text-white"
                        >
                          <FaUserEdit className="mr-2 text-xl text-primary dark:text-white" />
                        </Link>

                        {hasAnyPermissions(["categories.delete"]) && (
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="inline-flex rounded-md py-2 px-4 text-white"
                          >
                            <MdDeleteForever className="mr-2 text-xl text-danger dark:text-white" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-5 text-center text-lg font-semibold text-red-500 dark:text-white border border-stroke dark:border-strokedark"
                    >
                      No Data Found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Component */}
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
