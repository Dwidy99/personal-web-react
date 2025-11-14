import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Cookies from "js-cookie";
import hasAnyPermission from "@/utils/Permissions";

import {
  FaBarsProgress,
  FaCircleChevronDown,
  FaClipboardList,
  FaGaugeHigh,
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
      className={`absolute left-0 top-0 z-50 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-meta-4 lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link
          to="/admin/dashboard"
          className={`flex items-center rounded-md p-2 text-lg font-extrabold ${
            activeRoute[2] === "dashboard"
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
        >
          My Portfolio Website
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-white"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
      </div>

      {/* ===== Sidebar Content ===== */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* Main Dashboard */}
          <h3 className="mb-4 ml-4 flex items-center text-sm font-semibold text-bodydark2">
            <GrDashboard className="mr-2" />
            MAIN DASHBOARD
          </h3>
          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-9 text-bodydark2">
            {hasAnyPermission(["profiles.index"]) && (
              <li className="flex items-center gap-2">
                <ImProfile />
                {renderNavLink("/admin/dashboard", "Dashboard", activeRoute[2] === "dashboard")}
              </li>
            )}
          </ul>

          {/* Content Management */}
          {(hasAnyPermission(["projects.index"]) || hasAnyPermission(["experiences.index"])) && (
            <section>
              <h3 className="mb-4 ml-4 flex items-center text-sm font-semibold text-bodydark2">
                <FaWandMagicSparkles className="mr-2" /> CONTENT MANAGEMENT
              </h3>
              <ul className="mb-6 flex flex-col gap-1.5">
                <SidebarLinkGroup activeCondition={activeRoute[2] === "dashboard"}>
                  {(handleClick, open) => (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                        className="group relative flex w-full items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 hover:bg-graydark"
                      >
                        <FaWandSparkles className="mr-2" />
                        Contents
                        <FaCircleChevronDown
                          className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {open && (
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-9 text-bodydark2">
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

          {/* Media Management */}
          {(hasAnyPermission(["projects.index"]) ||
            hasAnyPermission(["contacts.index"]) ||
            hasAnyPermission(["configurations.update"])) && (
            <section>
              <h3 className="mb-4 ml-4 flex items-center text-sm font-semibold text-bodydark2">
                <FaBarsProgress className="mr-2" /> MEDIA MANAGEMENT
              </h3>
              <ul className="mb-6 flex flex-col gap-1.5 text-bodydark2">
                <SidebarLinkGroup activeCondition={activeRoute[2] === "dashboard"}>
                  {(handleClick, open) => (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                        className="group relative flex w-full items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 hover:bg-graydark dark:hover:bg-meta-4"
                      >
                        <FaPhotoFilm />
                        Media
                        <FaCircleChevronDown
                          className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {open && (
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-9">
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

          {/* Users Management */}
          <section>
            <h3 className="mb-4 ml-4 flex items-center text-sm font-semibold text-bodydark2">
              <FaUsersRectangle className="mr-2" /> USERS MANAGEMENT
            </h3>

            {(hasAnyPermission(["roles.index"]) ||
              hasAnyPermission(["permissions.index"]) ||
              hasAnyPermission(["users.index"])) && (
              <ul className="mb-6 flex flex-col gap-1.5">
                <SidebarLinkGroup activeCondition={activeRoute[2] === "users"}>
                  {(handleClick, open) => (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                        className="group relative flex w-full items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                      >
                        <FaUser />
                        Users
                        <FaCircleChevronDown
                          className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {open && (
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-9">
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

          {/* Logged-in Info */}
          <h3 className="mb-4 ml-4 flex items-center text-sm font-semibold text-bodydark2">
            <i className="fa-solid fa-circle-user mr-2"></i>
            {user.email} logged in
          </h3>
        </nav>
      </div>
    </aside>
  );
}
