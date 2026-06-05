import { useState, FormEvent } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import LayoutAuth from "../../layouts/Auth";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { AuthCredentials, ValidationErrors } from "@/types/shared/auth";
import { FaUser } from "react-icons/fa6";
import { RiLockPasswordLine } from "react-icons/ri";

// Service
import { authService } from "../../services";

export default function Login() {
  document.title = "Login - Admin CMS Portfolio";

  const navigate = useNavigate();
  const [form, setForm] = useState<AuthCredentials>({ email: "", password: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await authService.login(form);
      toast.success("Login successful!", { position: "top-center" });
      navigate("/admin/dashboard");
    } catch (error: any) {
      setErrors(error.response?.data?.errors || {});
      toast.error(error.response?.data?.message || "Login failed");
      setForm({ ...form, password: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (Cookies.get("token")) return <Navigate to="/admin/dashboard" replace />;

  return (
    <LayoutAuth>
      <div className="flex w-full items-center justify-center">
        <div className="w-full max-w-[420px] rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-black/10 sm:p-8">
          <div className="mb-7 text-center">
            <h4 className="text-2xl font-bold text-slate-900">Welcome Back</h4>
            <p className="mt-2 text-sm text-slate-500">Sign in to manage your portfolio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter email"
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter password"
                  required
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                isSubmitting ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>

            <div className="flex flex-col gap-3 text-center text-sm sm:flex-row sm:items-center sm:justify-between">
              <NavLink to="/" className="font-medium text-slate-500 hover:text-slate-800">
                Back to home
              </NavLink>
              <NavLink
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </LayoutAuth>
  );
}
