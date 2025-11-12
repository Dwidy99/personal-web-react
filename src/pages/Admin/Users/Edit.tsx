//import useNavigate useParams
import { Link, useNavigate, useParams } from "react-router-dom";
//import useState
import { useEffect, useState } from "react";

//import Cookies js
import Cookies from "js-cookie";
//import toast js
import toast from "react-hot-toast";

//import LayoutAdmin
import LayoutAdmin from "../../../layouts/Admin";

//improt Api
import Api from "../../../services/Api";
import { FaArrowLeft, FaUserGear } from "react-icons/fa6";
import { FaRegSave } from "react-icons/fa";
import { CiRedo } from "react-icons/ci";

export default function UsersEdit() {
  //title page
  document.title = "Edit Users - Desa Digital";

  //navigate
  const navigate = useNavigate();

  //get params
  const { id } = useParams();

  //define state for form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState([]);

  //set token
  const token = Cookies.get("token");

  //function "fetchDataPermissionData"
  const fetchDataRoles = async () => {
    await Api.get("/api/admin/roles/all", {
      //header
      headers: {
        //header Bearer + Token
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set response data to state "roles"
      setRoles(response.data.data);
    });
  };

  //function "fetchDataUser"
  const fetchDataUser = async () => {
    await Api.get(`/api/admin/users/${id}`, {
      //header
      headers: {
        //header + token
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set response data to state
      setName(response.data.data.name);
      setEmail(response.data.data.email);
      const userRoles = response.data.data.roles.map((obj) => obj.name);
      setSelectedRoles(userRoles); // Mengisi state dengan role pengguna yang ada
    });
  };

  //function to check if a role exists in the user's roles
  const hasRole = (roleName) => {
    return selectedRoles.includes(roleName); // Memeriksa apakah role ada di state selectedRoles
  };

  //useEffect
  useEffect(() => {
    //call function "fetchDataRoles"
    fetchDataRoles();

    //call function "fetchDataUsers"
    fetchDataUser();
  }, [id]); // Tambahkan 'id' sebagai dependency agar useEffect dijalankan kembali jika id berubah

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedRoles([...selectedRoles, value]);
    } else {
      setSelectedRoles(selectedRoles.filter((role) => role !== value));
    }
  };

  //function "updateUser"
  const updateUser = async (e) => {
    e.preventDefault();

    // Clear any existing errors
    setErrors([]);

    // Prepare roles data, send an empty array if no roles are selected
    const rolesToSend = selectedRoles.length > 0 ? selectedRoles : [];

    // Prepare data for update
    const payload = {
      name: name,
      email: email,
      roles: rolesToSend,
      _method: "PUT",
    };

    // Only include password and confirmation if they are not empty
    if (password) {
      payload.password = password;
      payload.password_confirmation = passwordConfirmation;
    }

    //sending data
    await Api.post(`/api/admin/users/${id}`, payload, {
      //header
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        //show toast
        toast.success(response.data.message, {
          position: "top-center",
          duration: 4000,
        });

        //navigate
        navigate("/admin/users");
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  return (
    <LayoutAdmin>
      <main className="p-6 sm:p-10">
        <div className="container mx-auto">
          <div className="mb-5">
            <Link
              to="/admin/users"
              className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm border-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md border-t-4 border-yellow-500">
            <div className="p-6">
              <h6 className="font-semibold text-lg text-gray-800 flex items-center mb-4">
                <FaUserGear className="mr-2" />
                Update User
              </h6>
              <hr className="mb-4" />
              <form onSubmit={updateUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Full Name.."
                    />
                    {errors.name && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email Address.."
                    />
                    {errors.email && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.email[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Password (Leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter New Password.."
                    />
                    {errors.password && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.password[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="passwordConfirmation"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Password Confirmation
                    </label>
                    <input
                      type="password"
                      id="passwordConfirmation"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      placeholder="Enter Password Confirmation.."
                    />
                    {errors.password_confirmation && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.password_confirmation[0]}
                      </div>
                    )}
                  </div>
                </div>

                <hr className="my-4" />
                <div className="mb-4">
                  <label
                    htmlFor="roles"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Roles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <div className="flex items-center" key={role.id}>
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                          value={role.name}
                          checked={hasRole(role.name)}
                          onChange={handleCheckboxChange}
                          id={`check-${role.id}`}
                        />
                        <label
                          className="ml-2 text-gray-700 text-sm"
                          htmlFor={`check-${role.id}`}
                        >
                          {role.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.roles && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.roles[0]}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                  >
                    <FaRegSave className="inline mr-2" />
                    Update
                  </button>
                  <button
                    type="reset"
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                  >
                    <CiRedo className="inline mr-2" />
                    Reset
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
