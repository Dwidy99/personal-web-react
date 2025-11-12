import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";

// Import js-cookie
import Cookies from "js-cookie";

// Import permissions
import hasAnyPermission from "../../../utils/Permissions";
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
} from "react-icons/fa6";
import PropTypes from "prop-types";
import { GoFileDiff } from "react-icons/go";
import { FaPhotoVideo, FaUserEdit, FaUsersCog } from "react-icons/fa";
import { GrDashboard, GrInsecure, GrSecure } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { TiContacts } from "react-icons/ti";
import { FcDataConfiguration } from "react-icons/fc";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const activeRoute = pathname.split("/");
  const user = JSON.parse(Cookies.get("user"));

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // Close sidebar on click outside
  useEffect(() => {
    const clickHandler = (event) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(event.target) ||
        trigger.current.contains(event.target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen]);

  // Close sidebar on ESC key press
  useEffect(() => {
    const keyHandler = (event) => {
      if (!sidebarOpen || event.keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen]);

  // Manage sidebar expanded state
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    document
      .querySelector("body")
      ?.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  // NavLink rendering helper
  const renderNavLink = (to, label, activeCondition) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center rounded-md px-3 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
          isActive || activeCondition ? "!text-white " : ""
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-meta-4 lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link
          className={`flex items-center p-2 font-extrabold text-lg tablet:text-sm rounded-md ${
            activeRoute[2] === "dashboard"
              ? "text-white bg-gray-700"
              : "text-gray-300 hover:text-white hover:bg-gray-700"
          }`}
          to="/admin/dashboard"
        >
          My Portfolio Website
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <i className="fa-solid fa-arrow-left text-white"></i>
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <NavLink>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2 flex items-center">
              <GrDashboard className="mr-2" />
              MAIN DASHBOARD
            </h3>
          </NavLink>
          <NavLink
            to="/admin/dashboard"
            className="group relative flex items-center rounded-md px-3 mb-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white"
          >
            <FaGaugeHigh className="mr-3" /> Dashboard
          </NavLink>
          {/* CONTENT MANAGEMENT */}
          {(hasAnyPermission(["projects.index"]) ||
            hasAnyPermission(["experiences.index"])) && (
            <>
              <NavLink>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2 flex items-center">
                  <FaWandMagicSparkles className="mr-2" />
                  CONTENT MANAGEMENT
                </h3>
              </NavLink>
              <ul className="mb-6 flex flex-col gap-1.5">
                {/* Contents Link */}
                <SidebarLinkGroup
                  activeCondition={activeRoute[2] === "dashboard"}
                >
                  {(handleClick, open) => (
                    <>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 hover:bg-graydark ${
                          open ? "" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <FaWandSparkles className="mr-2" />
                        Contents
                        <FaCircleChevronDown
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && "rotate-180"
                          }`}
                        />
                      </NavLink>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col text-bodydark2 gap-2.5 pl-9">
                          {hasAnyPermission(["profiles.index"]) && (
                            <li>
                              <div className="flex items-center">
                                <ImProfile />
                                {renderNavLink("/admin/profiles", "Profile")}
                              </div>
                            </li>
                          )}
                          {hasAnyPermission(["experiences.index"]) && (
                            <li>
                              <div className="flex items-center">
                                <FaClipboardList />
                                {renderNavLink(
                                  "/admin/experiences",
                                  "Experience"
                                )}
                              </div>
                            </li>
                          )}
                          {hasAnyPermission(["categories.index"]) && (
                            <li>
                              <div className="flex items-center">
                                <FaLayerGroup />
                                {renderNavLink(
                                  "/admin/categories",
                                  "Categories"
                                )}
                              </div>
                            </li>
                          )}
                          {hasAnyPermission(["posts.index"]) && (
                            <li>
                              <div className="flex items-center">
                                <GoFileDiff />
                                {renderNavLink("/admin/posts", "Posts")}
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>
              </ul>
            </>
          )}

          {/* MEDIA MANAGEMENT */}
          {(hasAnyPermission(["projects.index"]) ||
            hasAnyPermission(["contacts.index"]) ||
            hasAnyPermission(["configurations.update"])) && (
            <>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2 flex items-center">
                <FaBarsProgress className="mr-2" /> MEDIA MANAGEMENT
              </h3>
              <ul className="mb-6 flex flex-col text-bodydark2 gap-1.5">
                {/* Media Link */}
                <SidebarLinkGroup
                  activeCondition={activeRoute[2] === "dashboard"}
                >
                  {(handleClick, open) => (
                    <>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          open ? "" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <FaPhotoVideo />
                        Media
                        <FaCircleChevronDown
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && "rotate-180"
                          }`}
                        />
                      </NavLink>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-9">
                          <li>
                            <div className="flex items-center">
                              <FaImages />
                              {renderNavLink("/admin/projects", "Projects")}
                            </div>
                          </li>
                          <li>
                            <div className="flex items-center">
                              <TiContacts />
                              {renderNavLink("/admin/contacts", "Contacts")}
                            </div>
                          </li>
                          <li>
                            <div className="flex items-center">
                              <FcDataConfiguration />
                              {renderNavLink(
                                "/admin/configurations",
                                "Configurations"
                              )}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>
              </ul>
            </>
          )}

          {/* USERS MANAGEMENT */}
          <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2 flex items-center">
            <FaUsersCog className="mr-2" /> USERS MANAGEMENT
          </h3>

          {hasAnyPermission(["roles.index"]) ||
          hasAnyPermission(["permissions.index"]) ||
          hasAnyPermission(["users.index"]) ? (
            <ul className="mb-6 flex flex-col gap-1.5">
              <SidebarLinkGroup activeCondition={activeRoute[2] === "users"}>
                {(handleClick, open) => (
                  <>
                    <NavLink
                      to="#"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        open ? "" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        sidebarExpanded
                          ? handleClick()
                          : setSidebarExpanded(true);
                      }}
                    >
                      <FaUser />
                      Users
                      <FaCircleChevronDown
                        className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                          open && "rotate-180"
                        }`}
                      />
                    </NavLink>
                    <div
                      className={`translate transform overflow-hidden ${
                        !open && "hidden"
                      }`}
                    >
                      <ul className="mt-4 mb-5.5 flex flex-col text-bodydark2 gap-2.5 pl-9">
                        {hasAnyPermission(["roles.index"]) && (
                          <li>
                            <div className="flex items-center">
                              <GrSecure />
                              {renderNavLink("/admin/roles", "Roles")}
                            </div>
                          </li>
                        )}
                        {hasAnyPermission(["permissions.index"]) && (
                          <li>
                            <div className="flex items-center">
                              <GrInsecure />
                              {renderNavLink(
                                "/admin/permissions",
                                "Permissions"
                              )}
                            </div>
                          </li>
                        )}
                        {hasAnyPermission(["users.index"]) && (
                          <li>
                            <div className="flex items-center">
                              <FaUserEdit />
                              {renderNavLink("/admin/users", "Users")}
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>
            </ul>
          ) : null}

          <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2 flex items-center">
            <i className="fa-solid fa-circle-user mr-2"></i> {user.email} logged
            in
          </h3>
        </nav>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default Sidebar;
