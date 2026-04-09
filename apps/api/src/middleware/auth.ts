import type { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/auth";
import { HttpError } from "../utils/errors";
import type { Role } from "../types/auth";

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new HttpError(401, "Token tidak ditemukan");
  }

  req.user = verifyToken(token);
  next();
};

export const authorize = (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new HttpError(401, "Belum terautentikasi");
  }

  if (!roles.includes(req.user.role)) {
    throw new HttpError(403, "Akses ditolak untuk role ini");
  }

  next();
};
