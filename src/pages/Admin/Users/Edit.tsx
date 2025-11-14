import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import { FaArrowLeft, FaUserGear } from "react-icons/fa6";
import { CiRedo } from "react-icons/ci";
import { userService, roleService } from "@/services";
import type { UserForm } from "@/types/user";
import type { Role } from "@/types/role";
import { FaRegSave } from "react-icons/fa";

export default function UsersEdit() {
  document.title = "Edit User - Desa Digital";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    roles: [],
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // 🔹 Fetch all roles + user data
  const fetchData = async () => {
    try {
      const [roleRes, userRes] = await Promise.all([
        roleService.getAll(1, ""),
        userService.getById(Number(id)),
      ]);

      setRoles(roleRes.items);
      setFormData({
        name: userRes.name,
        email: userRes.email,
        password: "",
        password_confirmation: "",
        roles: userRes.roles.map((r) => r.name),
      });
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // 🔹 Handle input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle roles
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      roles: checked ? [...prev.roles, value] : prev.roles.filter((r) => r !== value),
    }));
  };

  // 🔹 Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      const res = await userService.update(Number(id), formData);
      toast.success(res.message || "User updated successfully");
      navigate("/admin/users");
    } catch (err: any) {
      setErrors(err.response?.data || {});
    }
  };

  const handleReset = () => {
    fetchData();
  };

  return (
    <LayoutAdmin>
      <main className="p-6 sm:p-10">
        <div className="container mx-auto">
          <div className="mb-5">
            <Link
              to="/admin/users"
              className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md border-t-4 border-yellow-500">
            <div className="p-6">
              <h6 className="font-semibold text-lg text-gray-800 flex items-center mb-4">
                <FaUserGear className="mr-2" />
                Edit User
              </h6>
              <hr className="mb-4" />

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email[0]}</p>}
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Roles */}
                <hr className="my-4" />
                <div>
                  <label className="block text-sm font-bold mb-2">Roles</label>
                  <div className="flex flex-wrap gap-4">
                    {roles.map((role) => (
                      <label key={role.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={role.name}
                          checked={formData.roles.includes(role.name)}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-green-600 border-gray-300 rounded"
                        />
                        <span>{role.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.roles && <p className="text-red-500 text-xs">{errors.roles[0]}</p>}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    <FaRegSave className="inline mr-2" /> Update
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                  >
                    <CiRedo className="inline mr-2" /> Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </LayoutAdmin>
  );
}
