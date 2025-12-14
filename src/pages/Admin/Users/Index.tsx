import { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import Pagination from "@/components/general/Pagination";
import hasAnyPermissions from "@/utils/Permissions";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import { userService } from "@/services";
import type { User } from "@/types/user";
import { MdPersonSearch } from "react-icons/md";
import { FaCirclePlus, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

type PageState = {
  currentPage: number;
  perPage: number;
  total: number;
};

export default function UsersIndex() {
  document.title = "Users - My Portfolio";

  const [users, setUsers] = useState<User[]>([]);
  const [keywords, setKeywords] = useState("");
  const [pagination, setPagination] = useState<PageState>({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const fetchData = async (page = 1, search = "") => {
    try {
      const res = await userService.getAll(page, search);
      setUsers(res.items || []);
      setPagination({
        currentPage: res.pagination.current_page ?? 1,
        perPage: res.pagination.per_page ?? 10,
        total: res.pagination.total ?? 0,
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load users");
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

  const handleDelete = (id: number | string) => {
    confirmAlert({
      title: "Delete User?",
      message: "Are you sure you want to delete this user?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            setUsers((prev) => prev.filter((item) => item.id !== id));

            try {
              await userService.delete(id);
              toast.success("User deleted successfully");

              setTimeout(() => {
                fetchData(pagination.currentPage, keywords);
              }, 0);
            } catch (error: any) {
              toast.error(error?.response?.data?.message || "Failed to delete user");
              fetchData(pagination.currentPage, keywords);
            }
          },
        },
        { label: "No", onClick: () => {} },
      ],
    });
  };

  const handlePageChange = (page: number) => fetchData(page, keywords);

  return (
    <LayoutAdmin>
      <div className="rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
              Users
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage users, roles, and permissions access.
            </p>
          </div>

          {hasAnyPermissions(["users.create"]) && (
            <Link
              to="/admin/users/create"
              className="inline-flex w-fit items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-opacity-90"
            >
              <FaCirclePlus className="mr-2" /> Add User
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
            placeholder="Search users..."
            className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white dark:border-strokedark focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Desktop/Tablet Table */}
        <div className="hidden sm:block overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 dark:bg-meta-4 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3 text-center font-semibold border-b w-16">No.</th>
                <th className="p-3 text-left font-semibold border-b">Full Name</th>
                <th className="p-3 text-left font-semibold border-b">Email</th>
                <th className="p-3 text-left font-semibold border-b">Roles</th>
                <th className="p-3 text-center font-semibold border-b w-32">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length ? (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-boxdark-2 transition-colors"
                  >
                    <td className="p-3 text-center font-medium">
                      {index + 1 + (pagination.currentPage - 1) * pagination.perPage}
                    </td>

                    <td className="p-3 font-medium text-slate-800 dark:text-gray-200">
                      {user.name}
                    </td>

                    <td className="p-3 text-slate-700 dark:text-gray-300">{user.email}</td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {user.roles?.length ? (
                          user.roles.map((role) => (
                            <span
                              key={role.id}
                              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-slate-700 dark:text-gray-200"
                            >
                              {role.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No roles</span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/users/edit/${user.id}`}
                          className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-white hover:bg-opacity-90"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>

                        {hasAnyPermissions(["users.delete"]) && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="inline-flex items-center justify-center rounded-md bg-danger px-3 py-2 text-white hover:bg-opacity-90"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-red-500 font-semibold">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="grid sm:hidden gap-4">
          {users.length ? (
            users.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-stroke dark:border-strokedark bg-white dark:bg-boxdark p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-gray-200 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Roles: {user.roles?.length ?? 0}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/admin/users/edit/${user.id}`}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-white hover:bg-opacity-90"
                      title="Edit"
                    >
                      <FaEdit />
                    </Link>

                    {hasAnyPermissions(["users.delete"]) && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="inline-flex items-center justify-center rounded-md bg-danger px-3 py-2 text-white hover:bg-opacity-90"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {user.roles?.length ? (
                    user.roles.map((role) => (
                      <span
                        key={role.id}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-slate-700 dark:text-gray-200"
                      >
                        {role.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">No roles</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-red-500 font-semibold py-10">No users found</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center sm:justify-end mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalCount={pagination.total}
            pageSize={pagination.perPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </LayoutAdmin>
  );
}
