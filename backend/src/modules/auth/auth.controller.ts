import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

export class AuthController {
  /**
   * Handler untuk registrasi user baru
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, roleId } = req.body;

      const user = await AuthService.registerUser(email, password, roleId);
      res.status(201).json({
        message: "User berhasil didaftarkan",
        user,
      });
    } catch (error: any) {
      if (error.message === "Email sudah terdaftar" || error.message === "Role tidak ditemukan") {
        res.status(400).json({ error: error.message });
      } else {
        console.error("Register error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server" });
      }
    }
  }

  /**
   * Handler untuk login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const data = await AuthService.loginUser(email, password);
      res.status(200).json({
        message: "Login berhasil",
        ...data,
      });
    } catch (error: any) {
      if (error.message === "Kredensial tidak valid") {
        res.status(401).json({ error: error.message });
      } else {
        console.error("Login error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server" });
      }
    }
  }

  /**
   * Handler untuk mendapatkan data user saat ini berdasarkan token
   */
  static async me(req: Request, res: Response): Promise<void> {
    // asumsikan req.user sudah di-set oleh verifyToken middleware
    const user = (req as any).user;
    
    if (!user) {
      res.status(401).json({ error: "Tidak ada akses" });
      return;
    }

    res.status(200).json({
      message: "Data user berhasil diambil",
      user,
    });
  }
}
