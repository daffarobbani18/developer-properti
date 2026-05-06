export type UserRole = "admin" | "inventory" | "sales" | "finance" | "legal" | "supervisor";

export const USER_ROLES: UserRole[] = ["admin", "inventory", "sales", "finance", "legal", "supervisor"];

export const PUBLIC_PATHS = ["/login", "/lupa-password"] as const;

export const ROLE_HOME: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  inventory: "/dashboard/inventory",
  sales: "/dashboard/sales",
  finance: "/dashboard/finance",
  legal: "/dashboard/legal",
  supervisor: "/dashboard/supervisor",
};

export const ROLE_ALLOWED_PREFIXES: Record<UserRole, string[]> = {
  admin: ["/dashboard/admin"],
  inventory: ["/dashboard/inventory", "/inventory", "/proyek"],
  sales: ["/dashboard/sales", "/sales", "/crm"],
  finance: ["/dashboard/finance", "/finance", "/keuangan"],
  legal: ["/dashboard/legal", "/legal"],
  supervisor: ["/dashboard/supervisor", "/supervisor", "/proyek"],
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
