//import useNavigate and useParams
import { Link, useNavigate, useParams } from "react-router-dom";
//import useState
import { useEffect, useState } from "react";

// import Api
import Api from "../../../services/Api";

//import LayoutAdmin
import LayoutAdmin from "../../../layouts/Admin";

//import toast js
import toast from "react-hot-toast";
//import Cokoies js
import Cookies from "js-cookie";

export default function RolesEdit() {
  //title page
  document.title = "Edit Role - Data Digital";

  //navigate
  const navigate = useNavigate();

  //get param id at URL
  const { id } = useParams();

  //define state for form
  const [name, setName] = useState("");
  const [permissionsData, setPermissionsData] = useState([]);
  const [errors, setErrors] = useState([]);

  //define state "permissionis"
  const [permissions, setPermissions] = useState([]);

  //get token
  const token = Cookies.get("token");

  //function "fetchDataPermissionsData"
  const fetchDataPermissions = async () => {
    await Api.get("/api/admin/permissions/all", {
      //header
      headers: {
        //header Bearer + Token
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set response data to state "permissions"
      setPermissions(response.data.data);
    });
  };

  //function "fetchDataRole"
  const fetchDataRole = async () => {
    await Api.get(`/api/admin/roles/${id}`, {
      //header
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set response data to state
      setName(response.data.data.name);
      setPermissionsData(response.data.data.permissions.map((obj) => obj.name));
    });
  };

  //useEffect
  useEffect(() => {
    //call function "fetchDataPermissions"
    fetchDataPermissions();

    //call function "fetchDataRole"
    fetchDataRole();
  }, []);

  //define function "handleCheckboxChange"
  const handleCheckboxChange = (e) => {
    //define data
    let data = permissionsData;

    //check item already exist, if so, remove filter
    if (data.some((name) => name === e.target.value)) {
      data = data.filter((name) => name !== e.target.value);
    } else {
      //push new item on array
      data.push(e.target.value);
    }

    //set data to state
    setPermissionsData(data);
  };

  const updateRole = async (e) => {
    e.preventDefault();

    await Api.post(
      `/api/admin/roles/${id}`,
      {
        //data
        name: name,
        permissions: permissionsData,
        _method: "PUT",
      },
      {
        //header
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        toast.success(response.data.message, {
          position: "top-center",
          duration: 4000,
        });

        //redirect
        navigate("/admin/roles");
      })
      .catch((err) => {
        //set error message to state "errors"
        setErrors(err.response.data);
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
        className="inline-flex items-center justify-center rounded-md bg-meta-4 text-white py-2 px-6 text-sm font-medium hover:bg-gray-700 focus:outline-none"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back
      </Link>

      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Create Role
        </h3>
        <form onSubmit={updateRole}>
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
            <label htmlFor="name" className="font-bold text-sm text-gray-700">
              Permissions
            </label>
            <div className="flex flex-wrap space-x-3 mt-1">
              {permissions.map((permission) => (
                <div
                  className="flex items-center space-x-2 space-y-2"
                  key={Math.random()}
                >
                  <input
                    className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                    type="checkbox"
                    value={permission.name}
                    defaultChecked={permissionsData.some(
                      (name) => name === permission.name ?? true
                    )}
                    onChange={handleCheckboxChange}
                    id={`check-${permission.id}`}
                    aria-describedby="comments-description"
                    placeholder="Enter role name.."
                  />
                  <label
                    className="text-sm text-gray-800"
                    htmlFor={`check-${permission.id}`}
                  >
                    {permission.name}
                  </label>
                </div>
              ))}
            </div>

            {errors.name && (
              <div className="alert alert-danger">{errors.permissions[0]}</div>
            )}
            <hr />
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
