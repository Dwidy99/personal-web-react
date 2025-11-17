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
    <header className="sticky top-0 z-50 flex w-full bg-white drop-shadow-sm dark:bg-boxdark transition-all duration-300">
      <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* === Left Section (Logo + Hamburger) === */}
        <div className="flex items-center gap-3">
          {/* Hamburger: visible only on mobile/tablet */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="sidebar-toggle relative z-50 flex h-16 w-16 flex-col items-center justify-center space-y-3.5 rounded-md bg-primary text-white shadow-md hover:bg-primary/90 active:scale-95 transition-all duration-300 lg:hidden"
          >
            <span
              className={`block h-[4px] w-10 rounded-full bg-white transition-transform duration-300 ease-in-out ${
                sidebarOpen ? "translate-y-[17px] rotate-45" : ""
              }`}
            ></span>
            <span
              className={`block h-[4px] w-10 rounded-full bg-white transition-opacity duration-300 ease-in-out ${
                sidebarOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block h-[4px] w-10 rounded-full bg-white transition-transform duration-300 ease-in-out ${
                sidebarOpen ? "-translate-y-[17px] -rotate-45" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* === Right Section (User dropdown) === */}
        <div className="flex items-center gap-3">
          <DropdownUser logout={logout} user={user} />
        </div>
      </div>
    </header>
  );
}
