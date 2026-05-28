import { Router } from "express";
import { CommissionController } from "../controllers/commission.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Endpoint untuk menghitung komisi (Sales & Finance)
/**
 * @swagger
 * /api/commissions/calculate:
 *   post:
 *     summary: Melakukan kalkulasi awal komisi penjualan
 *     tags: [Commission]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - salesUserId
 *               - percentage
 *             properties:
 *               bookingId:
 *                 type: string
 *               salesUserId:
 *                 type: string
 *               percentage:
 *                 type: number
 *                 description: Persentase komisi (maksimal 5%)
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Komisi berhasil dihitung (Pending)
 *       400:
 *         description: Persentase lebih dari batas atau Booking belum disetujui
 */
router.post(
  "/calculate",
  verifyToken,
  requireRole(["Sales", "Finance & Accounting"]),
  CommissionController.calculateCommission
);

// Endpoint untuk melihat daftar komisi
/**
 * @swagger
 * /api/commissions:
 *   get:
 *     summary: Melihat daftar komisi
 *     tags: [Commission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: salesUserId
 *         schema:
 *           type: string
 *         description: Filter berdasarkan ID Sales
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter berdasarkan status (Pending, Approved, Paid)
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data komisi
 */
router.get(
  "/",
  verifyToken,
  requireRole(["Sales", "Finance & Accounting", "Director"]),
  CommissionController.getAllCommissions
);

// Endpoint untuk persetujuan (Director)
/**
 * @swagger
 * /api/commissions/{id}/approve:
 *   put:
 *     summary: Menyetujui pencairan komisi
 *     tags: [Commission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Komisi disetujui
 *       400:
 *         description: Komisi tidak ditemukan atau tidak berstatus Pending
 */
router.put(
  "/:id/approve",
  verifyToken,
  requireRole(["Director"]),
  CommissionController.approveCommission
);

// Endpoint untuk pencairan dana (Finance)
/**
 * @swagger
 * /api/commissions/{id}/disburse:
 *   put:
 *     summary: Mencairkan dana komisi ke Sales
 *     tags: [Commission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dana berhasil dicairkan (Paid)
 *       400:
 *         description: Komisi belum disetujui atau sudah cair
 */
router.put(
  "/:id/disburse",
  verifyToken,
  requireRole(["Finance & Accounting"]),
  CommissionController.disburseCommission
);

export default router;
