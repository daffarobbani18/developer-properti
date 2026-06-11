import { Router } from "express";
import { FinanceController } from "./finance.controller.js";
import { verifyToken, requireRole } from "../../core/middlewares/auth.middleware.js";
import { validate } from "../../core/middlewares/validate.middleware.js";
import { verifyPaymentDto } from "./dto/finance.dto.js";
import { getSpkList, disburseSpk } from "./finance.spk.controller.js";

const router = Router();

// Melindungi semua rute di file ini dengan middleware token & role Finance & Accounting
router.use(verifyToken, requireRole(["Finance & Accounting"]));

/**
 * @swagger
 * /api/finance/bookings:
 *   get:
 *     summary: Mendapatkan daftar antrean verifikasi pembayaran booking atau riwayat booking
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter berdasarkan status (contoh: "Menunggu Verifikasi", "Approved", "Ditolak")
 *     responses:
 *       200:
 *         description: Berhasil mengambil data booking
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Bukan Finance & Accounting)
 */
router.get("/bookings", FinanceController.getBookings);

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
router.post("/bookings/:id/verify", validate(verifyPaymentDto), FinanceController.verifyPayment);

/**
 * @swagger
 * /api/finance/bookings/{id}/invoices:
 *   get:
 *     summary: Mengambil daftar invoice/tagihan lanjutan untuk sebuah booking
 */
router.get("/bookings/:id/invoices", FinanceController.getInvoicesByBooking);

/**
 * @swagger
 * /api/finance/bookings/{id}/invoices:
 *   post:
 *     summary: Membuat tagihan (Invoice) baru secara manual atau otomatis (Auto-Split)
 */
router.post("/bookings/:id/invoices", FinanceController.createInvoices);

/**
 * @swagger
 * /api/finance/invoices/{invoiceId}/payments:
 *   post:
 *     summary: Menerima pembayaran untuk suatu Invoice
 */
router.post("/invoices/:invoiceId/payments", FinanceController.receivePayment);

/**
 * @swagger
 * /api/finance/expenses:
 *   get:
 *     summary: Mendapatkan daftar pengeluaran (Expenses)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 */
router.get("/expenses", FinanceController.getExpenses);

/**
 * @swagger
 * /api/finance/expenses/{id}/status:
 *   put:
 *     summary: Memperbarui status pengeluaran (misal: "Sudah Ditransfer")
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 */
router.put("/expenses/:id/status", FinanceController.updateExpenseStatus);

/**
 * @swagger
 * /api/finance/spk:
 *   get:
 *     summary: Mendapatkan daftar SPK beserta progres dan kalkulasi sisa dana
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 */
router.get("/spk", getSpkList);

/**
 * @swagger
 * /api/finance/spk/{id}/disburse:
 *   post:
 *     summary: Pencairan kasbon/termin ke mandor secara manual
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 */
router.post("/spk/:id/disburse", disburseSpk);

export default router;
