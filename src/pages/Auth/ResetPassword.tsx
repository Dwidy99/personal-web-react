import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import LayoutAuth from "../../layouts/Auth";
import Api from "../../services/Api";
import toast from "react-hot-toast";
import { RiLockPasswordLine } from "react-icons/ri";

export default function ResetPassword() {
  document.title = "Reset Password - Admin CMS Portfolio";

  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await Api.post("/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      toast.success(response.data.message || "Password has been reset!", {
        position: "top-right",
        duration: 4000,
      });

      navigate("/login");
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, []);

  return (
    <LayoutAuth>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h4 className="text-white font-semibold text-xl">Reset Password</h4>
            <p className="text-gray-200 text-sm mt-1">
              Enter your new password below.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border-t-4 border-blue-500 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <div className="text-red-500 text-sm mt-2">
                    {errors.email[0]}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  New Password
                </label>
                <div className="relative mt-1">
                  <RiLockPasswordLine className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    className="w-full pl-8 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                {errors.password && (
                  <div className="text-red-500 text-sm mt-2">
                    {errors.password[0]}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <NavLink
                  to="/login"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Back to Login
                </NavLink>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 min-h-[40px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </LayoutAuth>
  );
}
