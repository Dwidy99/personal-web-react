import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import LayoutAdmin from "@/layouts/Admin";
import toast from "react-hot-toast";
import type { Permission } from "@/types/permission";
import type { RoleForm } from "@/types/role";

// Service
import { permissionService, roleService } from "@/services";

export default function RolesCreate() {
  document.title = "Create Role - Desa Digital";
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RoleForm>({
    name: "",
    permissions: [],
  });
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Fetch permissions
  useEffect(() => {
    (async () => {
      try {
        const data = await permissionService.getAll(1, "");
        setPermissions(data.items || []);
      } catch {
        toast.error("Failed to load permissions");
      }
    })();
  }, []);

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
    try {
      const res = await roleService.create(formData);
      toast.success(res.message || "Role created successfully");
      navigate("/admin/roles");
    } catch (err: any) {
      setErrors(err.response?.data || {});
      toast.error("Failed to create role");
    }
  };

  const handleReset = () => {
    setFormData({ name: "", permissions: [] });
    setErrors({});
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/roles"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Create Role</h3>
        <form onSubmit={handleSubmit}>
          {/* Name */}
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
