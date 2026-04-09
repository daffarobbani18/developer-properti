export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: "CUSTOMER";
};

export type AuthState = {
  token: string;
  user: AuthUser;
};
