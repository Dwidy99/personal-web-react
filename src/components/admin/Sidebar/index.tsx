import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Cookies from "js-cookie";
import hasAnyPermission from "@/utils/Permissions";

import {
  FaBarsProgress,
  FaCircleChevronDown,
  FaClipboardList,
  FaImages,
  FaLayerGroup,
  FaUser,
  FaWandMagicSparkles,
  FaWandSparkles,
  FaPhotoFilm,
  FaUserPen,
  FaUsersRectangle,
} from "react-icons/fa6";
import { GoFileDiff } from "react-icons/go";
import { GrDashboard, GrInsecure, GrSecure } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { TiContacts } from "react-icons/ti";
import { FcDataConfiguration } from "react-icons/fc";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const location = useLocation();
  const { pathname } = location;
  const activeRoute = pathname.split("/");

  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : { email: "guest@local" };

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(() => {
    const stored = localStorage.getItem("sidebar-expanded");
    return stored === "true";
  });

  /** 🔹 Close sidebar on click outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(event.target as Node) ||
        trigger.current.contains(event.target as Node)
      )
        return;
      setSidebarOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  /** 🔹 Close on ESC */
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [sidebarOpen, setSidebarOpen]);

  /** 🔹 Manage expand state */
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  /** 🔹 Helper for active links */
  const renderNavLink = (to: string, label: string, activeCondition?: boolean) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center rounded-md px-3 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
          isActive || activeCondition ? "!text-white" : ""
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <aside
      ref={sidebar}
      className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-black dark:bg-meta-4 shadow-lg transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:static lg:translate-x-0 lg:h-screen lg:w-72
      w-64 sm:w-72 md:w-72`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-strokedark">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <img src="/src/assets/admin/images/logo/logo-icon.svg" alt="Logo" className="w-6 h-6" />
          <span className="text-base font-semibold text-gray-300 dark:text-gray-500 truncate">
            Portfolio Admin
          </span>
        </Link>

        {/* Toggle button (mobile only) */}
        <button
          aria-controls="sidebar"
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="relative z-50 flex h-9 w-9 flex-col items-center justify-center space-y-1 rounded-md bg-primary text-white shadow-md hover:bg-primary/90 transition-all duration-300 lg:hidden"
        >
          <span
            className={`block h-[2px] w-5 bg-white transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-y-[6px] rotate-45" : ""
            }`}
          ></span>
          <span
            className={`block h-[2px] w-5 bg-white transition-opacity duration-300 ease-in-out ${
              sidebarOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`block h-[2px] w-5 bg-white transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* ===== Sidebar Content ===== */}
      <div className="flex-1 overflow-y-auto px-5 py-6 no-scrollbar">
        <nav className="space-y-8">
          {/* === Main Dashboard === */}
          <section>
            <h3 className="my-4 flex items-center text-sm font-semibold text-bodydark2">
              <GrDashboard className="mr-2" /> MAIN DASHBOARD
            </h3>
            <ul className="flex flex-col gap-2 pl-4">
              {hasAnyPermission(["profiles.index"]) && (
                <li className="flex items-center gap-2">
                  <ImProfile className="text-slate-300" />
                  {renderNavLink("/admin/dashboard", "Dashboard", activeRoute[2] === "dashboard")}
                </li>
              )}
            </ul>
          </section>

          {/* === Content Management === */}
          {(hasAnyPermission(["projects.index"]) || hasAnyPermission(["experiences.index"])) && (
            <section>
              <h3 className="mb-4 flex items-center text-sm font-semibold text-bodydark2">
                <FaWandMagicSparkles className="mr-2" /> CONTENT MANAGEMENT
              </h3>
              <ul className="flex flex-col gap-1">
                <SidebarLinkGroup activeCondition={activeRoute[2] === "dashboard"}>
                  {(handleClick, open) => (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                        className="group flex w-full items-center gap-2 rounded-sm px-4 py-2 font-medium text-bodydark1 hover:bg-gray-800"
                      >
                        <FaWandSparkles />
                        <span className="truncate">Contents</span>
                        <FaCircleChevronDown
                          className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </button>

                      {open && (
                        <ul className="mt-2 flex flex-col gap-2 pl-6 text-bodydark2">
                          {hasAnyPermission(["profiles.index"]) && (
                            <li className="flex items-center gap-2">
                              <ImProfile />
                              {renderNavLink("/admin/profiles", "Profile")}
                            </li>
                          )}
                          {hasAnyPermission(["experiences.index"]) && (
                            <li className="flex items-center gap-2">
                              <FaClipboardList />
                              {renderNavLink("/admin/experiences", "Experience")}
                            </li>
                          )}
                          {hasAnyPermission(["categories.index"]) && (
                            <li className="flex items-center gap-2">
                              <FaLayerGroup />
                              {renderNavLink("/admin/categories", "Categories")}
                            </li>
                          )}
                          {hasAnyPermission(["posts.index"]) && (
                            <li className="flex items-center gap-2">
                              <GoFileDiff />
                              {renderNavLink("/admin/posts", "Posts")}
                            </li>
                          )}
                        </ul>
                      )}
                    </>
                  )}
                </SidebarLinkGroup>
              </ul>
            </section>
          )}

          {/* === Media Management === */}
          {(hasAnyPermission(["projects.index"]) ||
            hasAnyPermission(["contacts.index"]) ||
            hasAnyPermission(["configurations.update"])) && (
            <section>
              <h3 className="mb-4 flex items-center text-sm font-semibold text-bodydark2">
                <FaBarsProgress className="mr-2" /> MEDIA MANAGEMENT
              </h3>
              <ul className="flex flex-col gap-1">
                <SidebarLinkGroup activeCondition={activeRoute[2] === "dashboard"}>
                  {(handleClick, open) => (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                        className="group flex w-full items-center gap-2 rounded-sm px-4 py-2 font-medium text-bodydark1 hover:bg-gray-800"
                      >
                        <FaPhotoFilm />
                        <span className="truncate">Media</span>
                        <FaCircleChevronDown
                          className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </button>

                      {open && (
                        <ul className="mt-2 flex flex-col gap-2 pl-6 text-bodydark2">
                          <li className="flex items-center gap-2">
                            <FaImages />
                            {renderNavLink("/admin/projects", "Projects")}
                          </li>
                          <li className="flex items-center gap-2">
                            <TiContacts />
                            {renderNavLink("/admin/contacts", "Contacts")}
                          </li>
                          <li className="flex items-center gap-2">
                            <FcDataConfiguration />
                            {renderNavLink("/admin/configurations", "Configurations")}
                          </li>
                        </ul>
                      )}
                    </>
                  )}
                </SidebarLinkGroup>
              </ul>
            </section>
          )}

          {/* === Users Management === */}
          <section>
            <h3 className="mb-4 flex items-center text-sm font-semibold text-bodydark2">
              <FaUsersRectangle className="mr-2" /> USERS MANAGEMENT
            </h3>
            {(hasAnyPermission(["roles.index"]) ||
              hasAnyPermission(["permissions.index"]) ||
              hasAnyPermission(["users.index"])) && (
              <ul className="flex flex-col gap-1">
                <SidebarLinkGroup activeCondition={activeRoute[2] === "users"}>
                  {(handleClick, open) => (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                        className="group flex w-full items-center gap-2 rounded-sm px-4 py-2 font-medium text-bodydark1 hover:bg-gray-800"
                      >
                        <FaUser />
                        <span className="truncate">Users</span>
                        <FaCircleChevronDown
                          className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </button>

                      {open && (
                        <ul className="mt-2 flex flex-col gap-2 pl-6 text-bodydark2">
                          {hasAnyPermission(["roles.index"]) && (
                            <li className="flex items-center gap-2">
                              <GrSecure />
                              {renderNavLink("/admin/roles", "Roles")}
                            </li>
                          )}
                          {hasAnyPermission(["permissions.index"]) && (
                            <li className="flex items-center gap-2">
                              <GrInsecure />
                              {renderNavLink("/admin/permissions", "Permissions")}
                            </li>
                          )}
                          {hasAnyPermission(["users.index"]) && (
                            <li className="flex items-center gap-2">
                              <FaUserPen />
                              {renderNavLink("/admin/users", "Users")}
                            </li>
                          )}
                        </ul>
                      )}
                    </>
                  )}
                </SidebarLinkGroup>
              </ul>
            )}
          </section>

          {/* === Logged-in Info === */}
          <h3 className="mt-8 ml-2 text-xs text-bodydark2 flex items-center gap-2 border-t border-gray-700 pt-3">
            <i className="fa-solid fa-circle-user"></i>
            {user.email} logged in
          </h3>
        </nav>
      </div>
    </aside>
  );
}
