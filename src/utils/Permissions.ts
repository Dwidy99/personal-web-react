import Cookies from "js-cookie";

export default function hasAnyPermissions(permissions: string[]): boolean {
  const cookieValue = Cookies.get("permissions");
  if (!cookieValue) return false;

  let allPermissions: Record<string, boolean> = {};

  try {
    allPermissions = JSON.parse(cookieValue);
  } catch (error) {
    console.error("Invalid permissions cookie:", error);
    return false;
  }

  return permissions.some((perm) => allPermissions[perm]);
}
