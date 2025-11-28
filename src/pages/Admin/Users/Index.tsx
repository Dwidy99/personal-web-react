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
            // 1️⃣ Optimistic update: immediately remove the user from UI
            setUsers((prev) => prev.filter((item) => item.id !== id));

            try {
              // 2️⃣ Perform API delete request
              await userService.delete(id);

              toast.success("User deleted successfully");

              // 3️⃣ Refresh data to ensure pagination and count remain accurate
              setTimeout(() => {
                fetchData(pagination.currentPage ?? 1, keywords);
              }, 0);
            } catch (error) {
              // 4️⃣ Rollback (restore data) if the delete request fails
              toast.error("Failed to delete user");
              fetchData(pagination.currentPage ?? 1, keywords);
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

        <table className="w-full table-auto border border-stroke rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr className="text-left">
              <th className="border p-3 w-[5%] text-center">No.</th>
              <th className="border p-3 w-[25%]">Full Name</th>
              <th className="border p-3 w-[30%]">Email</th>
              <th className="border p-3 w-[25%]">Roles</th>
              <th className="border p-3 w-[15%] text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="border p-3 text-center font-medium">
                    {index + 1 + (pagination.currentPage - 1) * pagination.perPage}
                  </td>

                  <td className="border p-3">{user.name}</td>

                  <td className="border p-3">{user.email}</td>

                  <td className="border p-3">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <span
                          key={role.id}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs font-medium"
                        >
                          {role.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="border p-3 text-center">
                    <div className="flex justify-center gap-3">
                      <Link
                        to={`/admin/users/edit/${user.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </Link>

                      {hasAnyPermissions(["users.delete"]) && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800"
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
                <td colSpan={5} className="p-6 text-center text-red-500 font-medium">
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
