export type UserRole = "admin" | "inventory" | "sales" | "finance" | "legal" | "supervisor";

export const USER_ROLES: UserRole[] = ["admin", "inventory", "sales", "finance", "legal", "supervisor"];

export const PUBLIC_PATHS = ["/login", "/lupa-password"] as const;

export const ROLE_HOME: Record<UserRole, string> = {
  admin: "/admin/dashboard", // Using admin as SuperAdmin if exists
  inventory: "/admin/dashboard", // Inventory acts as Admin
  sales: "/sales/dashboard",
  finance: "/finance/dashboard",
  legal: "/legal/dashboard",
  supervisor: "/dashboard/supervisor",
};

export const ROLE_ALLOWED_PREFIXES: Record<UserRole, string[]> = {
  admin: ["/admin"],
  inventory: ["/admin"],
  sales: ["/sales"],
  finance: ["/finance"],
  legal: ["/legal"],
  supervisor: ["/supervisor", "/dashboard/supervisor"],
};

export const isUserRole = (value: string | null | undefined): value is UserRole => {
  return Boolean(value && USER_ROLES.includes(value as UserRole));
};

export const isAllowedByPrefix = (pathname: string, prefixes: string[]) => {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
};

export const readRoleFromAuthPayload = (authRaw: string | null): UserRole | null => {
  if (!authRaw) {
    return null;
  }

  try {
    const parsed = JSON.parse(authRaw) as { role?: string };
    return isUserRole(parsed.role) ? parsed.role : null;
  } catch {
    return null;
  }
};
