import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import LayoutAuth from "../../layouts/Auth";
import toast from "react-hot-toast";
import { RiLockPasswordLine } from "react-icons/ri";
import { authService } from "../../services/authService";
import { ValidationErrors } from "../../types/auth";

export default function ResetPassword() {
  document.title = "Reset Password - Admin CMS Portfolio";

  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = new URLSearchParams(window.location.search).get("email");
    if (emailParam) setEmail(emailParam);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await authService.resetPassword({
        token: token!,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success("Password has been reset!");
      navigate("/login");
    } catch (error: any) {
      const apiErrors = error.response?.data?.errors;
      setErrors(apiErrors || {});
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAuth>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md border-t-4 border-blue-500 p-6">
          <h4 className="text-center text-xl font-semibold mb-2">Reset Password</h4>
          <p className="text-center text-gray-500 mb-6">Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border py-2 px-3 focus:ring-2 focus:ring-blue-400"
                placeholder="Enter email"
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 border rounded-lg py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter new password"
                  required
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-400"
                placeholder="Confirm password"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <NavLink to="/login" className="text-sm text-blue-600 hover:underline">
                Back to login
              </NavLink>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAuth>
  );
}
