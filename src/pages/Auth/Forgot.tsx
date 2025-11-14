import { useState, FormEvent } from "react";
import { NavLink } from "react-router-dom";
import LayoutAuth from "../../layouts/Auth";
import toast from "react-hot-toast";
import { FaEnvelope } from "react-icons/fa6";
import { authService } from "../../services/authService";
import { ValidationErrors } from "../../types/auth";

export default function ForgotPassword() {
  document.title = "Forgot Password - Admin CMS Portfolio";

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await authService.forgotPassword({ email });
      toast.success(res.message || "Password reset link sent!");
      setEmail("");
    } catch (error: any) {
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) setErrors(apiErrors);
      else toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAuth>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md border-t-4 border-yellow-500 p-6">
          <h4 className="text-center text-xl font-semibold mb-2 text-gray-800">
            Forgot Your Password?
          </h4>
          <p className="text-center text-gray-500 text-sm mb-6">
            Enter your email to receive a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border py-2 pl-9 pr-3 focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email[0]}</p>}
            </div>

            <div className="flex justify-between items-center">
              <NavLink to="/login" className="text-sm text-blue-600 hover:underline">
                Back to login
              </NavLink>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAuth>
  );
}
