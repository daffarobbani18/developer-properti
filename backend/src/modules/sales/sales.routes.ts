import { Router } from "express";
import { SalesController } from "./sales.controller.js";
import { verifyToken, requireRole } from "../../core/middlewares/auth.middleware.js";
import { validate } from "../../core/middlewares/validate.middleware.js";
import { createLeadDto, createBookingDto } from "./dto/sales.dto.js";

const router = Router();

// Melindungi rute di file ini menggunakan middleware token & role
router.use(verifyToken, requireRole(["Sales & Marketing", "Administrator"]));

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
router.post("/leads", validate(createLeadDto), SalesController.createLead);

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
 * /api/sales/leads/{id}:
 *   put:
 *     summary: Update profil prospek (Lead)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Berhasil diupdate
 */
router.put("/leads/:id", SalesController.updateLead);

/**
 * @swagger
 * /api/sales/leads/{id}:
 *   delete:
 *     summary: Hapus data prospek
 *     tags: [Sales]
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
 *         description: Berhasil dihapus
 */
router.delete("/leads/:id", SalesController.deleteLead);

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
router.post("/bookings", validate(createBookingDto), SalesController.createBooking);

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

// --- ACTIVITY ROUTES ---

/**
 * @swagger
 * /api/sales/activities:
 *   post:
 *     summary: Buat aktivitas baru (To-Do)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 */
router.post("/activities", SalesController.createActivity);

/**
 * @swagger
 * /api/sales/activities:
 *   get:
 *     summary: Mendapatkan daftar aktivitas sales
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 */
router.get("/activities", SalesController.getActivities);

/**
 * @swagger
 * /api/sales/activities/{id}:
 *   put:
 *     summary: Update status aktivitas (misal Selesai)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 */
router.put("/activities/:id", SalesController.updateActivityStatus);

/**
 * @swagger
 * /api/sales/activities/{id}:
 *   delete:
 *     summary: Hapus aktivitas
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/activities/:id", SalesController.deleteActivity);

export default router;
