import { Role } from "../types";

const ROLE_PERMISSIONS = {
  CUSTOMER: ["invoice:view", "payment:make", "ticket:create", "progress:view"] as const,
  SITE_ENGINEER: [
    "milestone:update",
    "report:create",
    "unit:view",
  ] as const,
  PROJECT_MANAGER: [] as const,
};

export type Permission =
  | (typeof ROLE_PERMISSIONS)["SITE_ENGINEER"][number]
 ;

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return (permissions as readonly string[]).includes(permission);
}

export function useRoleAccess(role: Role | undefined) {
  const can = (permission: Permission): boolean => {
    if (!role) return false;
    return hasPermission(role, permission);
  };

  return {
    isSiteEngineer: role === "SITE_ENGINEER",
    
    isCustomer: role === "CUSTOMER",
    can,
  };
}