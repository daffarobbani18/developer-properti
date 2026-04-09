export type CustomerRole = "CUSTOMER";

export type CustomerUser = {
  id: string;
  email: string;
  fullName: string;
  role: CustomerRole;
};

export type CustomerAuthState = {
  token: string;
  user: CustomerUser;
};
