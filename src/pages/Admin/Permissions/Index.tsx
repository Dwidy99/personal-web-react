import { useEffect, useState, ChangeEvent } from "react";
import LayoutAdmin from "@/layouts/Admin";
import Pagination from "@/components/general/Pagination";
import { MdPersonSearch } from "react-icons/md";
import { permissionService } from "@/services";
import type { Permission, PaginationMeta } from "@/types/permission";

export default function PermissionsIndex() {
  document.title = "Permissions - My Portfolio";

  // State—simple and readable
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState("");

  // Fetch data function (reusable pattern)
  const fetchData = async (page = 1, search = "") => {
    try {
      const { items, pagination } = await permissionService.getAll(page, search);
      setPermissions(items);
      setPagination(pagination);
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
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

  return (
    <LayoutAdmin>
      <div className="rounded-lg border bg-white px-5 pt-6 pb-3 shadow-md dark:bg-boxdark dark:border-strokedark">
        <h4 className="mb-6 text-xl font-semibold">Permission Lists</h4>

        {/* Search Box */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search permission..."
            value={keywords}
            onChange={handleSearch}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          />
          <MdPersonSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>

        {/* Table */}
        <table className="w-full border border-stroke rounded-md overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-center border">No</th>
              <th className="px-4 py-3 text-center border">Permission Name</th>
            </tr>
          </thead>

          <tbody>
            {permissions.length > 0 ? (
              permissions.map((permission, index) => (
                <tr key={permission.id}>
                  <td className="border p-3 text-center">
                    {index + 1 + (pagination.current_page - 1) * pagination.per_page}
                  </td>
                  <td className="border p-3 text-center">{permission.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center py-5 border text-red-500" colSpan={2}>
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
          onPageChange={(page) => fetchData(page, keywords)}
        />
      </div>
    </LayoutAdmin>
  );
}
