import jwt from "jsonwebtoken";

import { config } from "../config";
import type { AuthUser, Role } from "../types/auth";

type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};

export const signToken = (payload: AuthUser): string =>
  jwt.sign(
    {
      sub: payload.id,
      email: payload.email,
      role: payload.role
    },
    config.jwtSecret,
    { expiresIn: "1d" }
  );

export const verifyToken = (token: string): AuthUser => {
  const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
  return {
    id: decoded.sub,
    email: decoded.email,
    role: decoded.role
  };
};
