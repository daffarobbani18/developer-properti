import { Router } from "express";
import { ReportingController } from "./reporting.controller.js";
import { verifyToken, requireRole } from "../../core/middlewares/auth.middleware.js";
import { validate } from "../../core/middlewares/validate.middleware.js";
import { reportQueryDto } from "./dto/report-query.dto.js";

const router = Router();

// Melindungi rute ini dengan middleware token & role Director / Superadmin (Admin Inventory diganti Superadmin atau sesuaikan)
router.use(verifyToken, requireRole(["Owner", "Superadmin"]));

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     summary: Mendapatkan ringkasan Dasbor Eksekutif (Inventory, Keuangan, Performa Sales)
 *     tags: [Reporting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter tanggal awal (opsional)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter tanggal akhir (opsional)
 *     responses:
 *       200:
 *         description: Berhasil mengambil data reporting
 *         content:
 *           application/json:
 *             example:
 *               inventoryStats:
 *                 Tersedia: 45
 *                 Booked: 5
 *                 Terjual: 12
 *                 Diserahterimakan: 3
 *               financialStats:
 *                 totalRevenue: 2500000000
 *               salesPerformance:
 *                 - month: "2026-04"
 *                   totalApproved: 8
 *                 - month: "2026-05"
 *                   totalApproved: 12
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/dashboard", validate(reportQueryDto), ReportingController.getDashboardSummary);

export default router;
