import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Middleware untuk memverifikasi JWT token
 */
export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token tidak ditemukan, otorisasi ditolak" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Simpan payload ke req.user
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token tidak valid atau sudah kadaluarsa" });
  }
};

/**
 * Alias untuk menjaga kompatibilitas dengan kode sebelumnya
 */
export const authenticate = verifyToken;

/**
 * Middleware untuk mengecek role
 * @param roles Array dari role name yang diizinkan
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Otorisasi ditolak, user belum terverifikasi" });
      return;
    }

    
    // Superadmin bypasses role checks
    if (user.roleName === "Superadmin") {
      return next();
    }

    if (!roles.includes(user.roleName)) {

      res.status(403).json({ error: "Anda tidak memiliki akses ke resource ini" });
      return;
    }

    next();
  };
};
