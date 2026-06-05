import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import { userService, roleService } from "@/services";
import Loading from "@/components/admin/Loading";
import SubmitButton from "@/components/admin/SubmitButton";
import type { UserForm } from "@/types/user";
import type { Role } from "@/types/role";
import { FaArrowLeft } from "react-icons/fa6";
import {
  getErrorMessage,
  getValidationErrors,
  type AdminValidationErrors,
} from "@/features/admin/shared/utils/apiError";

export default function UsersCreate() {
  document.title = "Create User - Desa Digital";

  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<AdminValidationErrors>({});
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    roles: [],
  });

  const fetchRoles = useCallback(async (): Promise<void> => {
    setLoadingRoles(true);

    try {
      const res = await roleService.getAll(1, "");
      setRoles(res.items || []);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to load roles"));
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  useEffect(() => {
    void fetchRoles();
  }, [fetchRoles]);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (formData.password && formData.password.length < 3) {
      setErrors({ password: ["Password must be at least 3 characters"] });
      return;
    }

    try {
      setSubmitting(true);
      const res = await userService.create(formData);
      toast.success(res.message || "User created successfully");
      navigate("/admin/users");
    } catch (error: unknown) {
      setErrors(getValidationErrors(error));
      toast.error(getErrorMessage(error, "Failed to create user"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      roles: [],
    });
    setErrors({});
  };

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

      <div className="rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-2 sm:p-4 lg:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
          Create User
        </h3>

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
                disabled={submitting}
                className="w-full rounded-lg border border-stroke bg-transparent px-6 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter full name"
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
                disabled={submitting}
                className="w-full rounded-lg border border-stroke bg-transparent px-6 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter email address"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
            </div>
          </div>

          {/* Passwords */}
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
                disabled={submitting}
                className="w-full rounded-lg border border-stroke bg-transparent px-6 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter password"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
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
                disabled={submitting}
                className="w-full rounded-lg border border-stroke bg-transparent px-6 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm password"
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

            {loadingRoles ? (
              <Loading message="Loading roles..." variant="inline" className="mt-3" />
            ) : (
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
                      disabled={submitting}
                      className="h-5 w-5"
                    />
                    <span className="text-sm text-slate-700 dark:text-gray-200">{role.name}</span>
                  </label>
                ))}
              </div>
            )}

            {errors.roles && <p className="mt-2 text-xs text-red-500">{errors.roles[0]}</p>}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-gray-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              <i className="fa-solid fa-redo mr-2"></i> Reset
            </button>

            <SubmitButton loading={submitting} icon={<i className="fa-solid fa-save" />}>
              Save
            </SubmitButton>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
