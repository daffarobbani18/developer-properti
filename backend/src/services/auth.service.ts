import { prisma } from "../database/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const SALT_ROUNDS = 10;

export class AuthService {
  /**
   * Mendaftarkan pengguna baru
   */
  static async registerUser(email: string, passwordPlain: string, roleId: string) {
    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    // Cek apakah role valid
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new Error("Role tidak ditemukan");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(passwordPlain, SALT_ROUNDS);

    // Simpan user ke database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId,
      },
      include: {
        role: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role.name,
      createdAt: user.createdAt,
    };
  }

  /**
   * Melakukan login pengguna
   */
  static async loginUser(email: string, passwordPlain: string) {
    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new Error("Kredensial tidak valid");
    }

    // Verifikasi password
    const isPasswordMatch = await bcrypt.compare(passwordPlain, user.password);
    if (!isPasswordMatch) {
      throw new Error("Kredensial tidak valid");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        roleName: user.role.name,
      },
      JWT_SECRET,
      { expiresIn: "1d" } // Token berlaku 1 hari
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name,
      },
    };
  }
}
