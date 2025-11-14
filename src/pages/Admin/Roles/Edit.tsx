import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import type { RoleForm } from "@/types/role";
import type { Permission } from "@/types/permission";

// Service
import { permissionService, roleService } from "@/services";

export default function RolesEdit() {
  document.title = "Edit Role - Desa Digital";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<RoleForm>({
    name: "",
    permissions: [],
  });
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all permissions + role details
   */
  useEffect(() => {
    const fetchRoleAndPermissions = async () => {
      try {
        const [permRes, roleRes] = await Promise.all([
          permissionService.getAll(1, ""),
          roleService.getById(id!),
        ]);

        setPermissions(permRes.items || []);
        setFormData({
          name: roleRes.name || "",
          permissions: roleRes.permissions.map((p) => p.name),
        });
      } catch (err) {
        toast.error("Failed to load role data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoleAndPermissions();
  }, [id]);

  /**
   * Handle checkbox
   */
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, value]
        : prev.permissions.filter((p) => p !== value),
    }));
  };

  /**
   * Update Role
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const res = await roleService.update(id, formData);
      toast.success(res.message || "Role updated successfully");
      navigate("/admin/roles");
    } catch (err: any) {
      setErrors(err.response?.data || {});
      toast.error("Failed to update role");
    }
  };

  /**
   * Reset Form
   */
  const handleReset = () => {
    setFormData({ name: "", permissions: [] });
    setErrors({});
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading role data...</p>
        </div>
      </LayoutAdmin>
    );
  }

  /**
   * Render Form
   */
  return (
    <LayoutAdmin>
      <Link
        to="/admin/roles"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-gray-700"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Role</h3>

        <form onSubmit={handleSubmit}>
          {/* Role Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Role Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter role name..."
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
          </div>

          {/* Permissions */}
          <div className="mb-3">
            <label className="font-bold text-sm text-gray-700">Permissions</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {permissions.map((permission) => (
                <label key={permission.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={permission.name}
                    checked={formData.permissions.includes(permission.name)}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{permission.name}</span>
                </label>
              ))}
            </div>
            {errors.permissions && (
              <p className="text-red-500 text-xs mt-1">{errors.permissions[0]}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-5">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500"
            >
              <i className="fa-solid fa-save mr-2"></i> Save
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-400"
            >
              <i className="fa-solid fa-redo mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
