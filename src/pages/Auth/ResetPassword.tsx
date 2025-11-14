import { useEffect, useState, FormEvent } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import LayoutAuth from "../../layouts/Auth";
import toast from "react-hot-toast";
import { ValidationErrors } from "../../types/auth";
import { RiLockPasswordLine } from "react-icons/ri";

// Service
import { authService } from "../../services";

export default function ResetPassword() {
  document.title = "Reset Password - Admin CMS Portfolio";

  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const emailParam = new URLSearchParams(window.location.search).get("email");
    if (emailParam) setEmail(emailParam);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await authService.resetPassword({
        token: token!,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success(res.message || "Password reset successful!");
      navigate("/login");
    } catch (error: any) {
      setErrors(error.response?.data?.errors || {});
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LayoutAuth>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md border-t-4 border-blue-500 p-6">
          <h4 className="text-center text-xl font-semibold mb-4">Reset Password</h4>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md py-2 px-3"
                required
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">New Password</label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-md py-2 pl-9"
                  required
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password[0]}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full border rounded-md py-2 px-3"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <NavLink to="/login" className="text-blue-600 hover:underline text-sm">
                Back to Login
              </NavLink>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAuth>
  );
}
