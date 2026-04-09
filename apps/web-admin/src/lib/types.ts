export type Role =
  | "DIRECTOR"
  | "SALES_MANAGER"
  | "SALES"
  | "FINANCE_MANAGER"
  | "FINANCE_ADMIN"
  | "PROJECT_MANAGER"
  | "SITE_ENGINEER"
  | "LEGAL_ADMIN"
  | "CUSTOMER";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
};

export type AuthState = {
  token: string;
  user: AuthUser;
};
