import fs from "fs";
import path from "path";
import { Router } from "express";
import multer from "multer";
import { ConstructionController } from "./construction.controller.js";
import { verifyToken, requireRole } from "../../core/middlewares/auth.middleware.js";
import { validate } from "../../core/middlewares/validate.middleware.js";
import { recordProgressDto, createSpkDto } from "./dto/construction.dto.js";

const router = Router();

// Pastikan folder untuk foto progres konstruksi ada
const uploadDir = path.join(process.cwd(), "public", "uploads", "construction");
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
    cb(null, "progress-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Melindungi semua rute di file ini dengan middleware token & role
router.use(verifyToken, requireRole(["Pengawas Lapangan", "Project Manager", "Admin Inventory"]));

/**
 * @swagger
 * /api/construction/units/{unitId}/progress:
 *   post:
 *     summary: Mencatat progres pembangunan fisik unit lapangan
 *     tags: [Construction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unitId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Unit/Kavling yang sedang dibangun
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - percentage
 *               - description
 *             properties:
 *               percentage:
 *                 type: integer
 *                 description: Persentase progres (0 - 100)
 *               description:
 *                 type: string
 *                 description: Keterangan / Laporan progres
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Foto bukti progres lapangan (opsional)
 *     responses:
 *       201:
 *         description: Progres pembangunan berhasil dicatat
 *       400:
 *         description: Input tidak valid atau progres mundur dari sebelumnya
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Role tidak diizinkan)
 */
router.post("/units/:unitId/progress", upload.single("photo"), validate(recordProgressDto), ConstructionController.recordProgress);

/**
 * @swagger
 * /api/construction/units/{unitId}/progress:
 *   get:
 *     summary: Mendapatkan riwayat progres pembangunan suatu unit
 *     tags: [Construction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unitId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Unit/Kavling
 *     responses:
 *       200:
 *         description: Berhasil mengambil riwayat progres
 *       404:
 *         description: Unit tidak ditemukan
 */
router.get("/units/:unitId/progress", ConstructionController.getUnitProgressHistory);

// ==========================================
// RUTE SURAT PERINTAH KERJA (SPK) BORONGAN
// ==========================================

router.post("/spk", validate(createSpkDto), ConstructionController.createSpk);
router.get("/spk", ConstructionController.getSpkList);
router.get("/spk/:id", ConstructionController.getSpkDetail);

export default router;
