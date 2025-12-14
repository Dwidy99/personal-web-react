import { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import Pagination from "@/components/general/Pagination";
import hasAnyPermissions from "@/utils/Permissions";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import { MdDeleteForever, MdPersonSearch } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import type { Role } from "@/types/role";
import { roleService } from "@/services";
import { FaUserEdit } from "react-icons/fa";

type PageState = {
  currentPage: number;
  perPage: number;
  total: number;
};

export default function RolesIndex() {
  document.title = "Roles - Desa Digital";

  const [roles, setRoles] = useState<Role[]>([]);
  const [keywords, setKeywords] = useState("");
  const [pagination, setPagination] = useState<PageState>({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const fetchData = async (page = 1, search = "") => {
    try {
      const { items, pagination: pageInfo } = await roleService.getAll(page, search);

      setRoles(items || []);
      setPagination({
        currentPage: pageInfo.current_page ?? 1,
        perPage: pageInfo.per_page ?? 10,
        total: pageInfo.total ?? 0,
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load roles");
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
      message: "Are you sure you want to delete this role?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            // Optimistic UI
            setRoles((prev) => prev.filter((r) => r.id !== id));

            try {
              const res = await roleService.delete(id);
              toast.success(res.message || "Role deleted");

              setTimeout(() => fetchData(pagination.currentPage, keywords), 0);
            } catch (error: any) {
              toast.error(error?.response?.data?.message || "Failed to delete role");
              fetchData(pagination.currentPage, keywords);
            }
          },
        },
        { label: "No", onClick: () => {} },
      ],
    });
  };

  return (
    <LayoutAdmin>
      <div className="rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
              Role Lists
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage roles and their assigned permissions.
            </p>
          </div>

          {hasAnyPermissions(["roles.create"]) && (
            <Link
              to="/admin/roles/create"
              className="inline-flex w-fit items-center justify-center rounded-lg bg-meta-5 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              <FaCirclePlus className="mr-2" /> Add New
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <MdPersonSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={keywords}
            onChange={handleSearch}
            placeholder="Search roles..."
            className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white dark:border-strokedark focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 dark:bg-meta-4 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3 text-center font-semibold border-b">No.</th>
                <th className="p-3 text-left font-semibold border-b">Role</th>
                <th className="p-3 text-left font-semibold border-b">Permissions</th>
                <th className="p-3 text-center font-semibold border-b">Actions</th>
              </tr>
            </thead>

            <tbody>
              {roles.length ? (
                roles.map((role, index) => (
                  <tr
                    key={role.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-boxdark-2 transition-colors"
                  >
                    <td className="p-3 text-center">{index + 1}</td>

                    <td className="p-3 font-medium text-slate-800 dark:text-gray-200">
                      {role.name}
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {role.permissions?.length ? (
                          role.permissions.map((p) => (
                            <span
                              key={p.id}
                              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-slate-700 dark:text-gray-200"
                            >
                              {p.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No permissions</span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/roles/edit/${role.id}`}
                          className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-white hover:bg-opacity-90"
                          title="Edit"
                        >
                          <FaUserEdit />
                        </Link>

                        {hasAnyPermissions(["roles.delete"]) && (
                          <button
                            onClick={() => handleDelete(Number(role.id))}
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
                  <td colSpan={4} className="py-10 text-center text-red-500 font-semibold">
                    No Data Found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="grid sm:hidden gap-4">
          {roles.length ? (
            roles.map((role) => (
              <div
                key={role.id}
                className="rounded-xl border border-stroke dark:border-strokedark bg-white dark:bg-boxdark p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-gray-200 truncate">
                      {role.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Permissions: {role.permissions?.length ?? 0}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/admin/roles/edit/${role.id}`}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-white hover:bg-opacity-90"
                      title="Edit"
                    >
                      <FaUserEdit />
                    </Link>

                    {hasAnyPermissions(["roles.delete"]) && (
                      <button
                        onClick={() => handleDelete(Number(role.id))}
                        className="inline-flex items-center justify-center rounded-md bg-danger px-3 py-2 text-white hover:bg-opacity-90"
                        title="Delete"
                      >
                        <MdDeleteForever />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {role.permissions?.length ? (
                    role.permissions.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-slate-700 dark:text-gray-200"
                      >
                        {p.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">No permissions</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-red-500 font-semibold py-10">No Data Found!</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center sm:justify-end mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalCount={pagination.total}
            pageSize={pagination.perPage}
            onPageChange={(page) => fetchData(page, keywords)}
          />
        </div>
      </div>
    </LayoutAdmin>
  );
}
