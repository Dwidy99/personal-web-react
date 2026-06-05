import Cookies from "js-cookie";

type PermissionRecord = Record<string, unknown>;

function addPermissionName(names: Set<string>, value: unknown): void {
  if (typeof value === "string" && value.trim()) {
    names.add(value.trim());
  }
}

function collectPermissionNames(value: unknown, names = new Set<string>()): Set<string> {
  if (!value) {
    return names;
  }

  if (typeof value === "string") {
    addPermissionName(names, value);
    return names;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectPermissionNames(item, names));
    return names;
  }

  if (typeof value !== "object") {
    return names;
  }

  const record = value as PermissionRecord;

  addPermissionName(names, record.name);
  addPermissionName(names, record.permission);

  if (Array.isArray(record.data)) {
    collectPermissionNames(record.data, names);
  }

  if (Array.isArray(record.permissions)) {
    collectPermissionNames(record.permissions, names);
  }

  Object.entries(record).forEach(([key, isAllowed]) => {
    if (isAllowed === true || isAllowed === 1 || isAllowed === "1") {
      names.add(key);
    }
  });

  return names;
}

function getPermissionAliases(permission: string): string[] {
  const aliases = new Set([permission]);

  if (permission.endsWith(".store")) {
    aliases.add(permission.replace(/\.store$/, ".create"));
  }

  if (permission.endsWith(".create")) {
    aliases.add(permission.replace(/\.create$/, ".store"));
  }

  if (permission.endsWith(".update")) {
    aliases.add(permission.replace(/\.update$/, ".edit"));
  }

  if (permission.endsWith(".edit")) {
    aliases.add(permission.replace(/\.edit$/, ".update"));
  }

  return Array.from(aliases);
}

export default function hasAnyPermissions(permissions: string[]): boolean {
  const cookieValue = Cookies.get("permissions");

  if (!cookieValue) {
    return false;
  }

  try {
    const parsedPermissions: unknown = JSON.parse(cookieValue);
    const permissionNames = collectPermissionNames(parsedPermissions);

    if (permissionNames.has("*") || permissionNames.has("all")) {
      return true;
    }

    return permissions.some((permission) =>
      getPermissionAliases(permission).some((alias) => permissionNames.has(alias))
    );
  } catch {
    return false;
  }
}
