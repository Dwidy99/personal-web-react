import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../../services/Api";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function RolesCreate() {
  // Title page
  document.title = "Create Role - Desa Digital";

  // Navigate
  const navigate = useNavigate();

  // Define state for form
  const [name, setName] = useState("");
  const [permissionsData, setPermissionsData] = useState([]); // stores selected permissions
  const [errors, setErrors] = useState([]);

  // Define state for permissions
  const [permissions, setPermissions] = useState([]);

  // Token from cookies
  const token = Cookies.get("token");

  // Fetch permissions data
  const fetchDataPermissions = async () => {
    await Api.get("/api/admin/permissions/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setPermissions(response.data.data);
    });
  };

  useEffect(() => {
    fetchDataPermissions();
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setPermissionsData((prevData) =>
      checked ? [...prevData, value] : prevData.filter((item) => item !== value)
    );
  };

  // Handle form submission
  const storeRole = async (e) => {
    e.preventDefault();
    await Api.post(
      "/api/admin/roles",
      {
        name: name,
        permissions: permissionsData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        toast.success(response.data.message, {
          position: "top-right",
          duration: 4000,
        });
        navigate("/admin/roles");
      })
      .catch((error) => {
        setErrors(error.response.data);
      });
  };

  // Reset form
  const handleReset = () => {
    setName(""); // Reset role name
    setPermissionsData([]); // Reset permissions (checkboxes)
    setErrors([]); // Reset errors
  };

  return (
    <LayoutAdmin>
      <Link
        to="/admin/roles/"
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-lime-400 focus:outline-none"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Create Role
        </h3>
        <form onSubmit={storeRole}>
          {/* Role Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Role Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name.."
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
            )}
          </div>

          {/* Permissions */}
          <div className="mb-3">
            <label className="font-bold text-sm text-gray-700">
              Permissions
            </label>
            <div className="flex flex-wrap space-x-3 mt-1">
              {permissions.map((permission) => (
                <div
                  className="flex items-center space-x-2 space-y-2"
                  key={Math.random()}
                >
                  <input
                    type="checkbox"
                    value={permission.name}
                    checked={permissionsData.includes(permission.name)}
                    onChange={handleCheckboxChange}
                    id={`check-${permission.id}`}
                    className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`check-${permission.id}`}
                    className="text-sm text-gray-800"
                  >
                    {permission.name}
                  </label>
                </div>
              ))}
            </div>
            {errors.permissions && (
              <p className="text-red-500 text-xs mt-1">
                {errors.permissions[0]}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex mt-5.5 items-center space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500 focus:outline-none"
            >
              <i className="fa-solid fa-save mr-2"></i> Save
            </button>
            <button
              type="button"
              onClick={handleReset} // Call handleReset function
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none"
            >
              <i className="fa-solid fa-redo mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
