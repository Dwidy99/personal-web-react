import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import type { RoleForm } from "@/types/role";
import type { Permission } from "@/types/permission";
import { permissionService, roleService } from "@/services";

type FieldErrors = Record<string, string[]>;

export default function RolesEdit() {
  document.title = "Edit Role - Desa Digital";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<RoleForm>({ name: "", permissions: [] });
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleAndPermissions = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const [permRes, roleRes] = await Promise.all([
          permissionService.getAll(1, ""),
          roleService.getById(id),
        ]);

        setPermissions(permRes.items || []);
        setFormData({
          name: roleRes.name || "",
          permissions: roleRes.permissions?.map((p: any) => p.name) || [],
        });
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load role data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoleAndPermissions();
  }, [id]);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, value]
        : prev.permissions.filter((p) => p !== value),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setErrors({});
    try {
      const res = await roleService.update(id, formData);
      toast.success(res.message || "Role updated successfully");
      navigate("/admin/roles");
    } catch (err: any) {
      setErrors(err?.response?.data || {});
      toast.error(err?.response?.data?.message || "Failed to update role");
    }
  };

  const handleReset = () => {
    setErrors({});
    // reset to loaded state (not empty) is usually better for edit page:
    // simply do nothing if still loading.
  };

  return (
    <LayoutAdmin>
      <div className="mb-4">
        <Link
          to="/admin/roles"
          className="inline-flex items-center justify-center rounded-lg bg-meta-4 px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back
        </Link>
      </div>

      <div className="rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
          Edit Role
        </h3>

        {loading ? (
          <div className="rounded-lg border border-stroke dark:border-strokedark p-6 text-center text-sm text-gray-500">
            Loading role data...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
                Role Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter role name..."
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm dark:border-strokedark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
            </div>

            {/* Permissions */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Permissions
                </label>
                <span className="text-xs text-gray-500">
                  Selected: {formData.permissions.length}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {permissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-center gap-2 rounded-lg border border-stroke dark:border-strokedark p-3 hover:bg-gray-50 dark:hover:bg-boxdark-2 transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={permission.name}
                      checked={formData.permissions.includes(permission.name)}
                      onChange={handleCheckboxChange}
                      className="h-5 w-5"
                    />
                    <span className="text-sm text-slate-700 dark:text-gray-200">
                      {permission.name}
                    </span>
                  </label>
                ))}
              </div>

              {errors.permissions && (
                <p className="mt-2 text-xs text-red-500">{errors.permissions[0]}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-lg bg-gray-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <i className="fa-solid fa-redo mr-2"></i> Reset Errors
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <i className="fa-solid fa-save mr-2"></i> Save
              </button>
            </div>
          </form>
        )}
      </div>
    </LayoutAdmin>
  );
}
