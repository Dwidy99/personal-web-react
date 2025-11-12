import { useState } from "react";
import { NavLink } from "react-router-dom";
import LayoutAuth from "../../layouts/Auth";
import Api from "../../services/Api";
import toast from "react-hot-toast";
import { FaEnvelope } from "react-icons/fa6";

export default function ForgotPassword() {
  document.title = "Forgot Password - Admin CMS Portfolio";

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await Api.post("/api/forgot-password", { email });

      toast.success(response.data.message || "Password reset link sent!", {
        position: "top-right",
        duration: 4000,
      });

      setEmail(""); // Clear field
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          `Something went wrong. Please try again : ${error.response?.data.errors}`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LayoutAuth>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h4 className="text-white font-semibold text-xl">
              Forgot Your Password?
            </h4>
            <p className="text-gray-200 text-sm mt-1">
              Enter your email to receive a reset link.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border-t-4 border-yellow-500 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-7 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <div className="text-red-500 text-sm mt-2">
                    {errors.email[0]}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <NavLink
                  to="/login"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Back to login
                </NavLink>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`min-h-[40px] px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </LayoutAuth>
  );
}
