import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Mendaftarkan user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - roleId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User berhasil didaftarkan
 *       400:
 *         description: Input tidak valid atau email sudah terdaftar
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.post("/register", AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan token JWT
 *       400:
 *         description: Email atau password tidak diisi
 *       401:
 *         description: Kredensial tidak valid
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Mendapatkan data user saat ini
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data user
 *       401:
 *         description: Token tidak valid atau tidak ditemukan
 */
router.get("/me", verifyToken, AuthController.me);

export default router;
