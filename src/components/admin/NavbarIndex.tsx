import { useState, useEffect, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import Api from "@/services/Api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import avatar from "@/assets/admin/img/avatars/avatar-5.jpg";

interface User {
  name?: string;
  email?: string;
}

export default function NavbarIndex(): JSX.Element {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navigate = useNavigate();

  /** 🔹 Toggle sidebar class on body */
  const sidebarToggleHandler = (): void => {
    setSidebarToggle((prev) => {
      const newState = !prev;
      document.body.classList.toggle("sb-sidenav-toggled", newState);
      return newState;
    });
  };

  /** 🔹 Logout handler */
  const logout = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    try {
      await Api.post("/api/logout");
      Cookies.remove("user");
      Cookies.remove("token");
      Cookies.remove("permissions");
      toast.success("Logout Successfully!", { position: "top-center", duration: 4500 });
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.", { position: "top-center", duration: 4500 });
    }
  };

  /** 🔹 Ambil user dari cookie */
  const user: User | null = Cookies.get("user") ? JSON.parse(Cookies.get("user") as string) : null;

  /** 🔹 Toggle dropdown user */
  const toggleDropdown = (): void => {
    setDropdownOpen((prev) => !prev);
  };

  /** 🔹 Tutup dropdown ketika klik di luar */
  const closeDropdown = (e: MouseEvent | globalThis.MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (!target.closest("#user-menu-button") && !target.closest("#user-dropdown")) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown as EventListener);
    return () => {
      document.removeEventListener("click", closeDropdown as EventListener);
    };
  }, []);

  /** 🔹 Toggle navbar mobile */
  const toggleNavbar = (): void => {
    setNavbarOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Brand */}
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Dwi Y
          </span>
        </a>

        {/* User Menu & Hamburger */}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            id="user-menu-button"
            onClick={toggleDropdown}
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open user menu</span>
            <img className="w-8 h-8 rounded-full" src={avatar} alt="user avatar" />
          </button>

          {/* Dropdown Menu */}
          <div
            id="user-dropdown"
            className={`${
              dropdownOpen ? "block" : "hidden"
            } absolute right-0 top-4 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">
                {user?.name || "Guest User"}
              </span>
              <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                {user?.email || "guest@example.com"}
              </span>
            </div>
            <ul className="py-2">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Earnings
                </a>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>

          {/* Hamburger Menu Button */}
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            aria-controls="navbar-user"
            aria-expanded={navbarOpen ? "true" : "false"}
            onClick={toggleNavbar}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
