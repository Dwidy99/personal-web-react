import { useEffect, useState, ChangeEvent } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import { Permission, PaginationMeta } from "../../../types/permission";
import Pagination from "../../../components/general/Pagination";
import { MdPersonSearch } from "react-icons/md";

// Service
import { permissionService } from "../../../services";

export default function PermissionsIndex() {
  document.title = "Permissions - My Portfolio";

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState("");

  const fetchData = async (page = 1, search = "") => {
    try {
      const data = await permissionService.getAll(page, search);
      setPermissions(data.data);
      setPagination({
        current_page: data.current_page,
        per_page: data.per_page,
        total: data.total,
      });
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
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

  const handlePageChange = (pageNumber: number) => {
    fetchData(pageNumber, keywords);
  };

  return (
    <LayoutAdmin>
      <div className="rounded-lg border bg-white px-5 pt-6 pb-3 shadow-md dark:bg-boxdark dark:border-strokedark sm:px-7.5">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Permission Lists</h4>

        {/* Search */}
        <div className="flex mb-4">
          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                value={keywords}
                onChange={handleSearch}
                placeholder="Search permission..."
                className="w-full bg-transparent pl-10 pr-4 py-2 text-black dark:text-white border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <MdPersonSearch className="absolute left-3 top-2.5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full border border-stroke border-collapse rounded-sm overflow-x-auto dark:border-strokedark">
          <thead>
            <tr className="bg-gray-200 dark:bg-meta-4">
              <th className="py-3 px-4 text-center font-semibold text-black dark:text-white border">
                No.
              </th>
              <th className="py-3 px-4 text-center font-semibold text-black dark:text-white border">
                Permission Name
              </th>
            </tr>
          </thead>
          <tbody>
            {permissions.length > 0 ? (
              permissions.map((permission, index) => (
                <tr key={permission.id} className="border dark:border-strokedark">
                  <td className="py-3 px-4 text-center text-sm">
                    {index + 1 + (pagination.current_page - 1) * pagination.per_page}
                  </td>
                  <td className="py-3 px-4 text-center text-sm">{permission.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="py-5 px-4 text-center text-sm text-[#9D5425] border dark:border-strokedark"
                >
                  No Data Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          className="flex justify-end mt-4"
          currentPage={pagination.current_page}
          totalCount={pagination.total}
          pageSize={pagination.per_page}
          onPageChange={handlePageChange}
        />
      </div>
    </LayoutAdmin>
  );
}
