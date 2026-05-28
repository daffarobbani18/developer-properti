import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { verifyToken } from "../../core/middlewares/auth.middleware.js";
import { validate } from "../../core/middlewares/validate.middleware.js";
import { registerDto } from "./dto/register.dto.js";
import { loginDto } from "./dto/login.dto.js";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Mendaftarkan user baru (khusus Super Admin)
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
 *                 format: password
 *               roleId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User berhasil didaftarkan
 *       400:
 *         description: Bad request (misal email sudah ada)
 */
router.post("/register", validate(registerDto), AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user dan mendapatkan JWT token
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
 *                 format: password
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan token dan data user
 *       401:
 *         description: Kredensial tidak valid
 */
router.post("/login", validate(loginDto), AuthController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Mendapatkan data user yang sedang login berdasarkan token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *       401:
 *         description: Token tidak valid atau tidak ada
 */
router.get("/me", verifyToken, AuthController.me);

export default router;
