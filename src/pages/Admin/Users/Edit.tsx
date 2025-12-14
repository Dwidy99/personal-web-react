import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import { userService, roleService } from "@/services";
import type { UserForm } from "@/types/user";
import type { Role } from "@/types/role";
import { FaArrowLeft } from "react-icons/fa6";

type FieldErrors = Record<string, string[]>;

export default function UsersEdit() {
  document.title = "Edit User - Desa Digital";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [roles, setRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    roles: [],
  });

  const fetchData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [roleRes, userRes] = await Promise.all([
        roleService.getAll(1, ""),
        userService.getById(Number(id)),
      ]);

      setRoles(roleRes.items || []);
      setFormData({
        name: userRes.name || "",
        email: userRes.email || "",
        password: "",
        password_confirmation: "",
        roles: userRes.roles?.map((r) => r.name) || [],
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      roles: checked ? [...prev.roles, value] : prev.roles.filter((r) => r !== value),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setErrors({});
    try {
      const res = await userService.update(Number(id), formData);
      toast.success(res.message || "User updated successfully");
      navigate("/admin/users");
    } catch (err: any) {
      setErrors(err?.response?.data || {});
      toast.error(err?.response?.data?.message || "Failed to update user");
    }
  };

  const handleReset = () => fetchData();

  return (
    <LayoutAdmin>
      <div className="mb-4">
        <Link
          to="/admin/users"
          className="inline-flex items-center justify-center rounded-lg bg-meta-4 px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
        >
          <FaArrowLeft className="mr-2" /> Back
        </Link>
      </div>

      <div className="rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
          Edit User
        </h3>

        {loading ? (
          <div className="rounded-lg border border-stroke dark:border-strokedark p-6 text-center text-sm text-gray-500">
            Loading user data...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent px-6 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent px-6 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  className="w-full rounded-lg border border-stroke bg-transparent px-6 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent px-6 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Roles */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Roles
                </label>
                <span className="text-xs text-gray-500">Selected: {formData.roles.length}</span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {roles.map((role) => (
                  <label
                    key={role.id}
                    className="flex items-center gap-2 rounded-lg border border-stroke dark:border-strokedark p-3 hover:bg-gray-50 dark:hover:bg-boxdark-2 transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={role.name}
                      checked={formData.roles.includes(role.name)}
                      onChange={handleCheckboxChange}
                      className="h-5 w-5"
                    />
                    <span className="text-sm text-slate-700 dark:text-gray-200">{role.name}</span>
                  </label>
                ))}
              </div>

              {errors.roles && <p className="mt-2 text-xs text-red-500">{errors.roles[0]}</p>}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-lg bg-gray-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <i className="fa-solid fa-redo mr-2"></i> Reset
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <i className="fa-solid fa-save mr-2"></i> Update
              </button>
            </div>
          </form>
        )}
      </div>
    </LayoutAdmin>
  );
}
