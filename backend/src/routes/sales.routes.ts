import { Router } from "express";
import { SalesController } from "../controllers/sales.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Melindungi rute di file ini menggunakan middleware token & role
router.use(verifyToken, requireRole(["Sales & Marketing"]));

/**
 * @swagger
 * /api/sales/leads:
 *   post:
 *     summary: Input prospek baru (Lead)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - source
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               source:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lead prospek berhasil didaftarkan
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Bukan Sales & Marketing)
 */
router.post("/leads", SalesController.createLead);

/**
 * @swagger
 * /api/sales/leads:
 *   get:
 *     summary: Mendapatkan daftar prospek
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: statusCrm
 *         schema:
 *           type: string
 *         description: Filter berdasarkan status CRM prospek (contoh New, Follow Up, dll)
 *     responses:
 *       200:
 *         description: Berhasil mengambil data prospek
 */
router.get("/leads", SalesController.getAllLeads);

/**
 * @swagger
 * /api/sales/bookings:
 *   post:
 *     summary: Proses penguncian unit / booking
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *               - unitId
 *               - bookingFee
 *               - paymentMethod
 *             properties:
 *               leadId:
 *                 type: string
 *               unitId:
 *                 type: string
 *               bookingFee:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking berhasil dibuat dan unit telah dikunci
 *       400:
 *         description: Unit sudah tidak tersedia atau input tidak lengkap
 */
router.post("/bookings", SalesController.createBooking);

/**
 * @swagger
 * /api/sales/bookings:
 *   get:
 *     summary: Mendapatkan daftar riwayat booking
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil riwayat booking
 */
router.get("/bookings", SalesController.getAllBookings);

export default router;
