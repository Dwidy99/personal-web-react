// Import service
import Api from "../../services/Api";

// Import navigate
import { Navigate, NavLink, useNavigate } from "react-router-dom";

// Import layoutAuth
import LayoutAuth from "../../layouts/Auth";

// Import useState
import { useState } from "react";

// Import Cookies
import Cookies from "js-cookie";

// Import toast
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa6";
import { RiLockPasswordLine } from "react-icons/ri";

export default function Login() {
  // Title page
  document.title = "Login - Admin CMS Portfolio";

  // Navigate
  const navigate = useNavigate();

  // Define state
  const [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  // Define state errors
  const [errors, setErrors] = useState([]);

  // Method login
  const login = async (e) => {
    e.preventDefault();

    await Api.post("/api/login", {
      // Data
      email: email,
      password: password,
    })
      .then((response) => {
        // Set token to cookie
        Cookies.set("token", response.data.token);

        // Set user to cookies
        Cookies.set("user", JSON.stringify(response.data.user));

        // Set permissions to cookies
        Cookies.set("permissions", JSON.stringify(response.data.permissions));

        // Show toast
        toast.success("Login Successfully!", {
          position: "top-center",
          duration: 4000,
        });

        // Redirect to dashboard page
        navigate("/admin/dashboard");
      })
      .catch((error) => {
        // Set response error to state
        setErrors(error.response.data);
        // Set password empty
        setPassword("");
      });
  };

  // Check if cookie already exists
  if (Cookies.get("token")) {
    // Redirect to dashboard page
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <LayoutAuth>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h4 className="text-white font-semibold text-xl">
              Admin Page, by Dwi
            </h4>
          </div>
          <div className="bg-white rounded-xl shadow-md border-t-4 border-green-500 p-6">
            <div className="h-full">
              {errors.message && (
                <div className="bg-red-500 text-white p-3 rounded-md mb-4">
                  {errors.message}
                </div>
              )}
              <form onSubmit={login} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                      <FaUser className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="email"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-7 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email Address"
                    />
                  </div>
                  {errors.email && (
                    <div className="text-red-500 text-sm mt-2">
                      {errors.email[0]}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                      <RiLockPasswordLine className="text-gray-500" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-7 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                    />
                  </div>
                  {errors.password && (
                    <div className="text-red-500 text-sm mt-2">
                      {errors.password[0]}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <NavLink className="w-1/2" to="/">
                    <h4 className="mt-4 text-blue-600">Back to home page</h4>
                  </NavLink>
                  <button
                    className="w-1/2 min-h-[40px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    type="submit"
                  >
                    Login
                  </button>
                </div>

                <div className="text-right">
                  <NavLink
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot your password?
                  </NavLink>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LayoutAuth>
  );
}
