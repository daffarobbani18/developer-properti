import { Router } from "express";
import { BillingController } from "./billing.controller.js";
import { verifyToken, requireRole } from "../../core/middlewares/auth.middleware.js";
import { validate } from "../../core/middlewares/validate.middleware.js";
import { generateInvoiceDto, recordPaymentDto } from "./dto/billing.dto.js";

const router = Router();

// Melindungi rute menggunakan middleware token & role
router.use(verifyToken, requireRole(["Finance & Accounting"]));

/**
 * @swagger
 * /api/billing/invoices/generate:
 *   post:
 *     summary: Membuat jadwal tagihan otomatis (Generate Invoices)
 *     tags: [Billing]
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
 *               - totalAmount
 *               - tenor
 *               - invoiceType
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID Booking yang sudah di-Approve
 *               totalAmount:
 *                 type: number
 *                 description: Total nominal yang akan ditagihkan
 *               tenor:
 *                 type: number
 *                 description: Jumlah termin pembayaran
 *               invoiceType:
 *                 type: string
 *                 description: Jenis tagihan, contoh 'DP', 'Cicilan KPR'
 *     responses:
 *       201:
 *         description: Berhasil membuat jadwal tagihan
 *       400:
 *         description: Input tidak valid atau booking belum di-Approve
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Bukan Finance & Accounting)
 */
router.post("/invoices/generate", validate(generateInvoiceDto), BillingController.generateInvoices);

/**
 * @swagger
 * /api/billing/payments:
 *   post:
 *     summary: Mencatat uang masuk atau pelunasan tagihan
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoiceId
 *               - amountPaid
 *               - paymentMethod
 *             properties:
 *               invoiceId:
 *                 type: string
 *               amountPaid:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 description: Cara pembayaran (Transfer Bank, Cash, dll)
 *               referenceNumber:
 *                 type: string
 *                 description: Nomor referensi transfer (opsional)
 *     responses:
 *       201:
 *         description: Berhasil mencatat pembayaran
 *       400:
 *         description: Invoice tidak ditemukan atau sudah lunas
 */
router.post("/payments", validate(recordPaymentDto), BillingController.recordPayment);

/**
 * @swagger
 * /api/billing/{bookingId}/history:
 *   get:
 *     summary: Melihat buku piutang pelanggan (Riwayat Tagihan & Pembayaran)
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dari Booking
 *     responses:
 *       200:
 *         description: Berhasil mengambil riwayat tagihan dan pembayaran
 *       404:
 *         description: Booking tidak ditemukan
 */
router.get("/:bookingId/history", BillingController.getBillingHistory);

export default router;
