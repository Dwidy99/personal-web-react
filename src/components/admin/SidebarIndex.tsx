import { Sidebar } from "flowbite-react";
import {
  HiChartPie,
  HiPencil,
  HiInbox,
  HiUser,
  HiArrowSmRight,
  HiTable,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import hasAnyPermission from "../../utils/Permissions";

export default function SidebarIndex() {
  // Mendapatkan rute saat ini
  const location = useLocation();
  const { pathname } = location;

  // Mendapatkan data pengguna dari cookie
  const user = JSON.parse(Cookies.get("user") || "{}");

  return (
    <>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* Dashboard */}
          <Sidebar.Item
            as={Link}
            to="/admin/dashboard"
            icon={HiChartPie}
            active={pathname === "/admin/dashboard"}
          >
            Dashboard
          </Sidebar.Item>

          {/* Content Management */}
          {hasAnyPermission([
            "categories.index",
            "posts.index",
            "pages.index",
          ]) && (
            <Sidebar.Collapse label="Content Management" icon={HiPencil}>
              {hasAnyPermission(["categories.index"]) && (
                <Sidebar.Item
                  as={Link}
                  to="/admin/categories"
                  active={pathname === "/admin/categories"}
                >
                  Categories
                </Sidebar.Item>
              )}
              {hasAnyPermission(["posts.index"]) && (
                <Sidebar.Item
                  as={Link}
                  to="/admin/posts"
                  active={pathname === "/admin/posts"}
                >
                  Posts
                </Sidebar.Item>
              )}
              {hasAnyPermission(["pages.index"]) && (
                <Sidebar.Item
                  as={Link}
                  to="/admin/pages"
                  active={pathname === "/admin/pages"}
                >
                  Pages
                </Sidebar.Item>
              )}
            </Sidebar.Collapse>
          )}

          {/* Media Management */}
          {hasAnyPermission(["photos.index", "sliders.index"]) && (
            <Sidebar.Collapse label="Media Management" icon={HiInbox}>
              {hasAnyPermission(["photos.index"]) && (
                <Sidebar.Item
                  as={Link}
                  to="/admin/photos"
                  active={pathname === "/admin/photos"}
                >
                  Photos
                </Sidebar.Item>
              )}
              {hasAnyPermission(["sliders.index"]) && (
                <Sidebar.Item
                  as={Link}
                  to="/admin/sliders"
                  active={pathname === "/admin/sliders"}
                >
                  Sliders
                </Sidebar.Item>
              )}
            </Sidebar.Collapse>
          )}

          {/* Users Management */}
          {hasAnyPermission([
            "roles.index",
            "permissions.index",
            "users.index",
          ]) && (
            <Sidebar.Collapse label="Users Management" icon={HiUser}>
              {hasAnyPermission(["roles.index"]) && (
                <Sidebar.Item
                  as={Link}
                  to="/admin/roles"
                  active={pathname === "/admin/roles"}
                >
                  Roles
                </Sidebar.Item>
              )}
              {hasAnyPermission(["permissions.index"]) && (
                <Sidebar.Item
                  as={Link}
                  to="/admin/permissions"
                  active={pathname === "/admin/permissions"}
                >
                  Permissions
                </Sidebar.Item>
              )}
              {hasAnyPermission(["users.index"]) && (
                <Sidebar.Item
                  as={Link}
                  to="/admin/users"
                  active={pathname === "/admin/users"}
                >
                  Users
                </Sidebar.Item>
              )}
            </Sidebar.Collapse>
          )}

          {/* Aparaturs */}
          {hasAnyPermission(["aparaturs.index"]) && (
            <Sidebar.Item
              as={Link}
              to="/admin/aparaturs"
              icon={HiUser}
              active={pathname === "/admin/aparaturs"}
            >
              Aparaturs
            </Sidebar.Item>
          )}

          {/* Sign In/Sign Up */}
          <Sidebar.Item as={Link} to="/admin/sign-in" icon={HiArrowSmRight}>
            Sign In
          </Sidebar.Item>
          <Sidebar.Item as={Link} to="/admin/sign-up" icon={HiTable}>
            Sign Up
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>

      {/* Footer */}
      <div className="p-4 bg-gray-800 text-white">
        <div className="text-sm">Logged in as:</div>
        <div className="font-bold">{user.email || "Unknown"}</div>
      </div>
    </>
  );
}
