import { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import Pagination from "@/components/general/Pagination";
import hasAnyPermissions from "@/utils/Permissions";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import { MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import type { Role } from "@/types/role";

// Service
import { roleService } from "@/services";

export default function RolesIndex() {
  document.title = "Roles - Desa Digital";

  const [roles, setRoles] = useState<Role[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });
  const [keywords, setKeywords] = useState("");

  const fetchData = async (page = 1, search = "") => {
    try {
      const { items, pagination: pageInfo } = await roleService.getAll(page, search);
      setRoles(items);
      setPagination({
        currentPage: pageInfo.current_page,
        perPage: pageInfo.per_page,
        total: pageInfo.total,
      });
    } catch {
      toast.error("Failed to load roles");
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

  const handleDelete = (id: number) => {
    confirmAlert({
      title: "Delete Role?",
      message: "Are you sure want to delete this role?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const res = await roleService.delete(id);
              toast.success(res.message || "Role deleted");
              fetchData(pagination.currentPage, keywords);
            } catch {
              toast.error("Failed to delete role");
            }
          },
        },
        { label: "No", onClick: () => {} },
      ],
    });
  };

  return (
    <LayoutAdmin>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
        <div className="flex justify-between mb-4">
          <h4 className="text-xl font-semibold text-black dark:text-white">Role Lists</h4>
          {hasAnyPermissions(["roles.create"]) && (
            <Link
              to="/admin/roles/create"
              className="inline-flex items-center justify-center rounded-md bg-meta-5 py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
            >
              <FaCirclePlus className="mr-2" /> Add New
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            value={keywords}
            onChange={handleSearch}
            placeholder="Search roles..."
            className="w-full bg-transparent pl-10 pr-4 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="button" className="absolute left-0 top-1/2 -translate-y-1/2 p-2">
            <MdPersonSearch />
          </button>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-stroke text-center">
          <thead className="bg-gray-200 dark:bg-meta-4">
            <tr>
              <th className="py-3 px-4 border">No.</th>
              <th className="py-3 px-4 border">Role</th>
              <th className="py-3 px-4 border">Permissions</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.length ? (
              roles.map((role, index) => (
                <tr key={role.id}>
                  <td className="py-3 border">{index + 1}</td>
                  <td className="py-3 border">{role.name}</td>
                  <td className="py-3 border">
                    {role.permissions.map((p) => (
                      <span
                        key={p.id}
                        className="inline-block bg-primary bg-opacity-10 text-primary text-xs px-3 py-1 rounded-full m-1"
                      >
                        {p.name}
                      </span>
                    ))}
                  </td>
                  <td className="py-3 border space-x-3">
                    <Link
                      to={`/admin/roles/edit/${role.id}`}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      <i className="fa fa-edit"></i>
                    </Link>
                    {hasAnyPermissions(["roles.delete"]) && (
                      <button
                        onClick={() => handleDelete(Number(role.id))}
                        className="text-red-600 hover:text-red-500"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-5 text-center text-red-500">
                  No Data Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          className="flex justify-end my-4"
          currentPage={pagination.currentPage}
          totalCount={pagination.total}
          pageSize={pagination.perPage}
          onPageChange={(page) => fetchData(page, keywords)}
        />
      </div>
    </LayoutAdmin>
  );
}
