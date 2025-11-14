import { useState, FormEvent } from "react";
import LayoutAuth from "../../layouts/Auth";
import toast from "react-hot-toast";
import { FaEnvelope } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { ValidationErrors } from "../../types/auth";

// Service
import { authService } from "../../services";

export default function ForgotPassword() {
  document.title = "Forgot Password - Admin CMS Portfolio";

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await authService.forgotPassword({ email });
      toast.success(res.message || "Password reset link sent!");
      setEmail("");
    } catch (error: any) {
      setErrors(error.response?.data?.errors || {});
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LayoutAuth>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md border-t-4 border-yellow-500 p-6">
          <h4 className="text-center text-xl font-semibold mb-4">Forgot Password</h4>
          <p className="text-center text-gray-500 text-sm mb-4">
            Enter your email to receive a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 border rounded-md py-2"
                  placeholder="Enter your email"
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div className="flex justify-between items-center">
              <NavLink to="/login" className="text-sm text-blue-600 hover:underline">
                Back to Login
              </NavLink>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAuth>
  );
}
