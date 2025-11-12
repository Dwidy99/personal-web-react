import { Link, useNavigate } from "react-router-dom";
import DropdownUser from "./DropdownUser";
import LogoIcon from "@/assets/admin/images/logo/logo.svg";
import { useState, useCallback, useEffect } from "react";
import Api from "@/services/Api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await Api.post("/api/logout");
      Cookies.remove("user");
      Cookies.remove("token");
      Cookies.remove("permissions");
      toast.success("Logout Successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed, please try again.");
    }
  }, [navigate]);

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white drop-shadow-sm dark:bg-boxdark">
      <div className="flex flex-grow items-center justify-end px-4 py-4 sm:justify-between md:justify-end">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark"
          >
            <span className="block h-5.5 w-5.5 cursor-pointer">
              <span
                className={`block h-0.5 w-full bg-black dark:bg-white ${
                  sidebarOpen ? "rotate-45" : ""
                }`}
              ></span>
            </span>
          </button>

          <Link to="/" className="block flex-shrink-0 lg:hidden">
            <img src={LogoIcon} alt="Logo" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <DropdownUser logout={logout} user={user} />
        </div>
      </div>
    </header>
  );
}
