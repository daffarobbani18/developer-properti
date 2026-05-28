import fs from "fs";
import path from "path";
import { Router } from "express";
import multer from "multer";
import { LegalController } from "./legal.controller.js";
import { verifyToken, requireRole } from "../../core/middlewares/auth.middleware.js";
import { validate } from "../../core/middlewares/validate.middleware.js";
import { createLegalDocDto, scheduleBastDto, completeBastDto } from "./dto/legal.dto.js";

const router = Router();

// Pastikan folder untuk dokumen legal ada
const uploadDir = path.join(process.cwd(), "public", "uploads", "legal");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "doc-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Melindungi rute ini dengan middleware token & role
router.use(verifyToken, requireRole(["Tim Legal", "Director"]));

/**
 * @swagger
 * /api/legal/documents:
 *   post:
 *     summary: Menambah atau memperbarui status dokumen legal (PPJB, AJB, SHM, IMB)
 *     tags: [Legal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - documentType
 *               - status
 *             properties:
 *               bookingId:
 *                 type: string
 *               documentType:
 *                 type: string
 *                 description: Contoh 'PPJB', 'AJB', 'SHM', 'IMB'
 *               status:
 *                 type: string
 *                 description: Contoh 'Diproses', 'Selesai'
 *               notes:
 *                 type: string
 *                 description: Catatan tambahan
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Scan dokumen (opsional)
 *     responses:
 *       200:
 *         description: Dokumen legal berhasil direkam/diperbarui
 *       400:
 *         description: Input tidak valid
 */
router.post("/documents", upload.single("file"), validate(createLegalDocDto), LegalController.createOrUpdateLegalDoc);

/**
 * @swagger
 * /api/legal/bookings/{bookingId}/documents:
 *   get:
 *     summary: Melihat riwayat dan status dokumen legal serta BAST suatu transaksi booking
 *     tags: [Legal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mengambil data
 *       404:
 *         description: Booking tidak ditemukan
 */
router.get("/bookings/:bookingId/documents", LegalController.getBookingLegalDocs);

/**
 * @swagger
 * /api/legal/bast/schedule:
 *   post:
 *     summary: Menjadwalkan Serah Terima Kunci (BAST)
 *     tags: [Legal]
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
 *               - handoverDate
 *             properties:
 *               bookingId:
 *                 type: string
 *               handoverDate:
 *                 type: string
 *                 format: date-time
 *               remarks:
 *                 type: string
 *     responses:
 *       201:
 *         description: Berhasil menjadwalkan BAST
 *       400:
 *         description: Rumah belum Siap Huni atau input tidak valid
 */
router.post("/bast/schedule", validate(scheduleBastDto), LegalController.scheduleBast);

/**
 * @swagger
 * /api/legal/bast/{bastId}/complete:
 *   put:
 *     summary: Menyelesaikan proses BAST dan mengubah status kavling menjadi Diserahterimakan
 *     tags: [Legal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bastId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               remarks:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Scan dokumen PDF BAST yang telah ditandatangani
 *     responses:
 *       200:
 *         description: Proses Serah Terima Selesai
 *       400:
 *         description: BAST tidak ditemukan atau sudah selesai
 */
router.put("/bast/:bastId/complete", upload.single("file"), validate(completeBastDto), LegalController.completeBast);

export default router;
