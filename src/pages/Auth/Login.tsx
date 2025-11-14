import { useState, FormEvent } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import LayoutAuth from "../../layouts/Auth";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa6";
import { RiLockPasswordLine } from "react-icons/ri";
import Cookies from "js-cookie";
import { authService } from "../../services/authService";
import { ValidationErrors } from "../../types/auth";

export default function Login() {
  document.title = "Login - Admin CMS Portfolio";

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  if (authService.isAuthenticated()) return <Navigate to="/admin/dashboard" replace />;

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      await authService.login({ email, password });
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      setPassword("");
      const apiErrors = error.response?.data;
      setErrors(apiErrors?.errors || {});
      toast.error(apiErrors?.message || "Login failed. Check your credentials.");
    }
  };

  return (
    <LayoutAuth>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md border-t-4 border-green-500 p-6">
          <h4 className="text-center text-xl font-semibold mb-4">Admin Login</h4>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <FaUser className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border py-2 pl-9 pr-3 focus:ring-2 focus:ring-green-400"
                  placeholder="Enter email"
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <RiLockPasswordLine className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border py-2 pl-9 pr-3 focus:ring-2 focus:ring-green-400"
                  placeholder="Enter password"
                  required
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password[0]}</p>}
            </div>

            <div className="flex justify-between items-center">
              <NavLink to="/" className="text-sm text-blue-600 hover:underline">
                Back to Home
              </NavLink>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Login
              </button>
            </div>

            <div className="text-right">
              <NavLink to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot your password?
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </LayoutAuth>
  );
}
