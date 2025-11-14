import { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";
import Cookies from "js-cookie";
import hasAnyPermissions from "../../../utils/Permissions";
import Pagination from "../../../components/general/Pagination";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";

// Icons
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";

// Types
import { Experience } from "../../../types/experience";

interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
}

export default function ExperiencesIndex() {
  document.title = "Experience Page - My Portfolio";

  // ✅ State
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const token = Cookies.get("token");

  // ✅ Fetch data
  const fetchData = async (pageNumber = 1, searchKeyword = "") => {
    setLoading(true);
    try {
      const response = await Api.get(`/api/admin/experiences`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchKeyword, page: pageNumber },
      });

      const { data } = response.data;
      setExperiences(data.data);
      setPagination({
        currentPage: data.current_page,
        perPage: data.per_page,
        total: data.total,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Search handler
  const searchData = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeywords(value);
    fetchData(1, value);
  };

  // ✅ Delete handler
  const deleteExperience = (id: number) => {
    confirmAlert({
      title: "Are you sure?",
      message: "Do you really want to delete this data?",
      buttons: [
        {
          label: "YES",
          onClick: async () => {
            try {
              const res = await Api.delete(`/api/admin/experiences/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              toast.success(res.data.message, { position: "top-center" });
              fetchData(pagination.currentPage, keywords);
            } catch (err: any) {
              toast.error(err.response?.data?.message || "Failed to delete");
            }
          },
        },
        { label: "NO", onClick: () => {} },
      ],
    });
  };

  // ✅ Page change handler
  const handlePageChange = (pageNumber: number) => {
    fetchData(pageNumber, keywords);
  };

  return (
    <LayoutAdmin>
      <div className="rounded-md border border-stroke bg-white p-6 shadow-md dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Experience Lists</h4>

        {/* Top Controls */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
          {/* Add Button */}
          {hasAnyPermissions(["experiences.create"]) && (
            <Link
              to="/admin/experiences/create"
              className="inline-flex items-center justify-center rounded-md bg-meta-5 py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
            >
              <FaCirclePlus className="text-white mr-2" /> Add New
            </Link>
          )}

          {/* Search Box */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              onChange={searchData}
              value={keywords}
              placeholder="Search here..."
              className="w-full border border-stroke rounded-lg p-2 pl-10 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <MdPersonSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-stroke dark:border-strokedark">
            <thead>
              <tr className="bg-gray-200 dark:bg-meta-4 text-sm text-black dark:text-white">
                <th className="py-3 px-4 border border-stroke w-[5%]">No</th>
                <th className="py-3 px-4 border border-stroke w-[20%]">Job Title</th>
                <th className="py-3 px-4 border border-stroke w-[10%]">Company Icon</th>
                <th className="py-3 px-4 border border-stroke w-[15%]">Start Date</th>
                <th className="py-3 px-4 border border-stroke w-[15%]">End Date</th>
                <th className="py-3 px-4 border border-stroke w-[10%]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-300">
                    Loading data...
                  </td>
                </tr>
              ) : experiences.length > 0 ? (
                experiences.map((exp, index) => (
                  <tr key={exp.id} className="text-center text-sm border-t dark:border-strokedark">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{exp.name}</td>
                    <td className="py-3 px-4">
                      {exp.image ? (
                        <img
                          src={exp.image}
                          alt={exp.name}
                          className="w-10 h-10 mx-auto rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(exp.start_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(exp.end_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      <Link
                        to={`/admin/experiences/edit/${exp.id}`}
                        className="inline-flex items-center justify-center font-medium text-primary"
                      >
                        <FaUserEdit className="text-lg" />
                      </Link>

                      {hasAnyPermissions(["experiences.delete"]) && (
                        <button
                          onClick={() => deleteExperience(exp.id)}
                          className="inline-flex items-center justify-center font-medium text-danger"
                        >
                          <MdDeleteForever className="text-xl" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#9D5425] dark:text-gray-300">
                    No Data Found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
