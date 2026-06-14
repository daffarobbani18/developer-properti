import { Request, Response } from "express";
import { prisma } from "../../core/config/prisma.js";
import bcrypt from "bcrypt";

export class UserController {
  /**
   * Mendapatkan daftar semua user
   */
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        include: { role: true },
        orderBy: { createdAt: "desc" },
      });

      const formattedUsers = users.map(u => ({
        id: u.id,
        email: u.email,
        roleId: u.roleId,
        roleName: u.role.name,
        allowedMenus: u.allowedMenus,
        createdAt: u.createdAt
      }));

      res.status(200).json({ data: formattedUsers });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Gagal mengambil data pengguna." });
    }
  }

  /**
   * Menambahkan user baru
   */
  static async createUser(req: Request, res: Response) {
    try {
      const { email, password, roleId, allowedMenus } = req.body;

      if (!email || !password || !roleId) {
        return res.status(400).json({ error: "Email, password, dan roleId wajib diisi." });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email sudah terdaftar." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          roleId,
          allowedMenus: allowedMenus || []
        },
        include: { role: true }
      });

      res.status(201).json({
        message: "User berhasil dibuat",
        data: {
          id: user.id,
          email: user.email,
          roleName: user.role.name,
          allowedMenus: user.allowedMenus
        }
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Gagal membuat pengguna." });
    }
  }

  /**
   * Update data user (termasuk allowedMenus)
   */
  static async updateUser(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { email, password, roleId, allowedMenus } = req.body;

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return res.status(404).json({ error: "Pengguna tidak ditemukan." });
      }

      const updateData: any = {};
      if (email) updateData.email = email;
      if (roleId) updateData.roleId = roleId;
      if (allowedMenus) updateData.allowedMenus = allowedMenus;

      if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        include: { role: true }
      });

      res.status(200).json({
        message: "Pengguna berhasil diperbarui",
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          roleName: (updatedUser as any).role?.name || "",
          allowedMenus: (updatedUser as any).allowedMenus
        }
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Gagal memperbarui pengguna." });
    }
  }

  /**
   * Menghapus user
   */
  static async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await prisma.user.delete({ where: { id } });
      res.status(200).json({ message: "Pengguna berhasil dihapus." });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Gagal menghapus pengguna." });
    }
  }

  /**
   * Mendapatkan daftar Roles
   */
  static async getRoles(req: Request, res: Response) {
    try {
      const roles = await prisma.role.findMany();
      res.status(200).json({ data: roles });
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil daftar peran (roles)." });
    }
  }
}
