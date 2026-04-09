export const ROLES = [
  "DIRECTOR",
  "SALES_MANAGER",
  "SALES",
  "FINANCE_MANAGER",
  "FINANCE_ADMIN",
  "PROJECT_MANAGER",
  "SITE_ENGINEER",
  "LEGAL_ADMIN",
  "CUSTOMER"
] as const;

export type Role = (typeof ROLES)[number];

export const isRole = (value: string): value is Role =>
  (ROLES as readonly string[]).includes(value);

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};
