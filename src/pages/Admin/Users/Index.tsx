import { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import Pagination from "@/components/general/Pagination";
import hasAnyPermissions from "@/utils/Permissions";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import { userService } from "@/services";
import { User } from "@/types/user";
import { MdPersonSearch } from "react-icons/md";
import { FaCirclePlus, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

export default function UsersIndex() {
  document.title = "Users - My Portfolio";

  const [users, setUsers] = useState<User[]>([]);
  const [keywords, setKeywords] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const fetchData = async (page = 1, search = "") => {
    try {
      const res = await userService.getAll(page, search);
      setUsers(res.items);
      setPagination({
        currentPage: res.pagination.current_page,
        perPage: res.pagination.per_page,
        total: res.pagination.total,
      });
    } catch (err) {
      toast.error("Failed to load users");
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
            try {
              await userService.delete(id);
              toast.success("User deleted successfully");
              fetchData();
            } catch {
              toast.error("Failed to delete user");
            }
          },
        },
        { label: "No", onClick: () => {} },
      ],
    });
  };

  const handlePageChange = (page: number) => {
    fetchData(page, keywords);
  };

  return (
    <LayoutAdmin>
      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between mb-4">
          {hasAnyPermissions(["users.create"]) && (
            <Link
              to="/admin/users/create"
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
            >
              <FaCirclePlus /> Add User
            </Link>
          )}

          <div className="relative w-1/3">
            <input
              type="text"
              value={keywords}
              onChange={handleSearch}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
            <MdPersonSearch className="absolute left-2 top-2.5 text-gray-500" />
          </div>
        </div>

        <table className="w-full text-left border-collapse border border-stroke">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">No.</th>
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Roles</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td className="border p-2 text-center">
                    {index + 1 + (pagination.currentPage - 1) * pagination.perPage}
                  </td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">
                    {user.roles.map((role) => (
                      <span
                        key={role.id}
                        className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded mr-1 text-xs"
                      >
                        {role.name}
                      </span>
                    ))}
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <Link
                      to={`/admin/users/edit/${user.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </Link>
                    {hasAnyPermissions(["users.delete"]) && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-red-500">
                  No users found
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
          onPageChange={handlePageChange}
        />
      </div>
    </LayoutAdmin>
  );
}
