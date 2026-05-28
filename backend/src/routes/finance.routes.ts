import { Router } from "express";
import { FinanceController } from "../controllers/finance.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Melindungi semua rute di file ini dengan middleware token & role Finance & Accounting
router.use(verifyToken, requireRole(["Finance & Accounting"]));

/**
 * @swagger
 * /api/finance/bookings/pending:
 *   get:
 *     summary: Mendapatkan daftar antrean verifikasi pembayaran booking
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data antrean booking
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Bukan Finance & Accounting)
 */
router.get("/bookings/pending", FinanceController.getPendingBookings);

/**
 * @swagger
 * /api/finance/bookings/{id}/verify:
 *   post:
 *     summary: Proses Approve atau Reject pembayaran booking
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dari Booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [Approve, Reject]
 *                 description: Status persetujuan
 *               financeNotes:
 *                 type: string
 *                 description: Catatan tambahan dari pihak Finance
 *     responses:
 *       200:
 *         description: Pembayaran berhasil diverifikasi (Approve/Reject)
 *       400:
 *         description: Parameter tidak valid atau booking tidak ditemukan
 */
router.post("/bookings/:id/verify", FinanceController.verifyPayment);

export default router;
