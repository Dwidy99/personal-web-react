import { useState, FormEvent } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import LayoutAuth from "../../layouts/Auth";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { AuthCredentials, ValidationErrors } from "../../types/auth";
import { FaUser } from "react-icons/fa6";
import { RiLockPasswordLine } from "react-icons/ri";

// Service
import { authService } from "../../services";

export default function Login() {
  document.title = "Login - Admin CMS Portfolio";

  const navigate = useNavigate();
  const [form, setForm] = useState<AuthCredentials>({ email: "", password: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await authService.login(form);
      toast.success("Login successful!", { position: "top-center" });
      navigate("/admin/dashboard");
    } catch (error: any) {
      setErrors(error.response?.data?.errors || {});
      toast.error(error.response?.data?.message || "Login failed");
      setForm({ ...form, password: "" });
    }
  };

  if (Cookies.get("token")) return <Navigate to="/admin/dashboard" replace />;

  return (
    <LayoutAuth>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md border-t-4 border-green-500 p-6">
          <h4 className="text-center mb-6 text-xl font-semibold text-black">Welcome Back!</h4>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-9 border rounded-md py-2"
                  placeholder="Enter email"
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-9 border rounded-md py-2"
                  placeholder="Enter password"
                  required
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
            </div>

            <div className="flex justify-between items-center">
              <NavLink to="/" className="text-blue-600 hover:underline text-sm">
                Back to Home
              </NavLink>
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </div>

            <div className="text-right">
              <NavLink to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </LayoutAuth>
  );
}
