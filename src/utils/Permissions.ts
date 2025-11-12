//import Cookies
import Cookies from "js-cookie";

export default function hasAnyPermissions(permissions) {
  //get permissions from cookies
  let allPermissions = JSON.parse(Cookies.get("permissions"));

  let hasPermission = false;

  permissions.forEach(function (item) {
    if (allPermissions[item]) hasPermission = true;
  });

  return hasPermission;
}
