//improt Link, useNavigate
import { Link, useNavigate } from "react-router-dom";
//improt useEffect, useState
import { useEffect, useState } from "react";

//import LayoutAdmiin
import LayoutAdmin from "../../../layouts/Admin";

//import LayoutAdmiin
import Api from "../../../services/Api";

//import toast
import toast from "react-hot-toast";
//import toast
import Cookies from "js-cookie";
import { FaArrowLeft, FaUserGear } from "react-icons/fa6";
import { FaRegSave } from "react-icons/fa";
import { CiRedo } from "react-icons/ci";

export default function UsersCreate() {
  // title page
  document.title = "Create User - Desa Digital";

  //navigate
  const navigate = useNavigate();

  //define state for form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState([]);

  //token
  const token = Cookies.get("token");

  //function "fetchDataRoles"
  const fetchDataRole = async () => {
    await Api.get(`/api/admin/roles/all`, {
      //header
      headers: {
        //header + Token
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set response data to state "roles"
      setRoles(response.data.data);
    });
  };

  //useEffect
  useEffect(() => {
    //call function "fetchDataRoles"
    fetchDataRole();
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedRoles((prev) => {
      if (checked) {
        // Add the role if it's not already present
        return [...new Set([...prev, value])];
      } else {
        // Remove the role
        return prev.filter((role) => role !== value);
      }
    });
  };

  const storeUser = async (e) => {
    e.preventDefault();

    // Clear any existing errors
    setErrors([]);

    // Basic frontend validation
    if (password.length < 3) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: ["Password should be at least 3 characters long"],
      }));
      return;
    }

    try {
      const response = await Api.post(
        `/api/admin/users`,
        {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          roles: selectedRoles, // Send the selected roles
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message if backend validation passes
      toast.success(response.data.message, {
        position: "top-center",
        duration: 4000,
      });
      navigate("/admin/users");
    } catch (err) {
      // Handle backend validation errors
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        toast.error("An error occurred while creating the user", {
          position: "top-center",
          duration: 4000,
        });
      }
    }
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
          <div className="bg-white rounded-lg shadow-md border-t-4 border-green-500">
            <div className="p-6">
              <h6 className="font-semibold text-lg text-gray-800 flex items-center mb-4">
                <FaUserGear className="mr-2" />
                Create User
              </h6>
              <hr className="mb-4" />
              <form onSubmit={storeUser} className="space-y-4">
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
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password.."
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
                  </div>
                </div>

                <hr className="my-4" />
                <div className="mb-4">
                  <label
                    htmlFor="roles"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Roles *
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          value={role.name}
                          checked={selectedRoles.includes(role.name)}
                          onChange={handleCheckboxChange}
                          id={`role-${role.id}`}
                        />
                        <label
                          htmlFor={`role-${role.id}`}
                          className="ml-2 block text-sm text-gray-700"
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
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                  >
                    <FaRegSave className="inline mr-2" />
                    Save
                  </button>
                  <button
                    type="reset"
                    className="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-3 rounded focus:outline-none focus:shadow-outline"
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
