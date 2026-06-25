export type UserRole = "admin" | "inventory" | "sales" | "finance" | "legal" | "supervisor" | "owner";

export const USER_ROLES: UserRole[] = ["admin", "inventory", "sales", "finance", "legal", "supervisor", "owner"];

export const PUBLIC_PATHS = ["/login", "/lupa-password"] as const;

export const ROLE_HOME: Record<UserRole, string> = {
  admin: "/admin/dashboard", // Using admin as SuperAdmin if exists
  inventory: "/admin/dashboard", // Inventory acts as Admin
  sales: "/sales/dashboard",
  finance: "/finance/dashboard",
  legal: "/legal/dashboard",
  supervisor: "/dashboard/supervisor",
  owner: "/admin/dashboard",
};

export const ROLE_ALLOWED_PREFIXES: Record<UserRole, string[]> = {
  admin: ["/admin", "/print"],
  inventory: ["/admin", "/print"],
  sales: ["/sales"],
  finance: ["/finance"],
  legal: ["/legal"],
  supervisor: ["/supervisor", "/dashboard/supervisor"],
  owner: ["/"], // Owner has access to everything effectively
};

export const isUserRole = (value: string | null | undefined): value is UserRole => {
  return Boolean(value && USER_ROLES.includes(value as UserRole));
};

export const isAllowedByPrefix = (pathname: string, prefixes: string[]) => {
  return prefixes.some((prefix) => {
    if (prefix === "/") return true; // Owner has access to everything
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
};

export interface AuthPayload {
  role: UserRole;
  isOwner?: boolean;
  allowedMenus?: string[];
  token?: string;
}

export const readAuthPayload = (authRaw: string | null): AuthPayload | null => {
  if (!authRaw) {
    return null;
  }

  try {
    const parsed = JSON.parse(authRaw);
    return {
      role: isUserRole(parsed.role) ? parsed.role : "admin",
      isOwner: parsed.isOwner || false,
      allowedMenus: parsed.allowedMenus || [],
      token: parsed.token,
    };
  } catch {
    return null;
  }
};

export const readRoleFromAuthPayload = (authRaw: string | null): UserRole | null => {
  const payload = readAuthPayload(authRaw);
  return payload ? payload.role : null;
};
