import fs from "fs";
import path from "path";
import { Router } from "express";
import multer from "multer";
import { KprController } from "./kpr.controller.js";
import { verifyToken, requireRole } from "../../core/middlewares/auth.middleware.js";

const router = Router();

// Konfigurasi Multer untuk dokumen KPR (Laci Digital)
const uploadDir = path.join(process.cwd(), "public", "uploads", "legal");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "kpr-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Role Tim Legal
router.use(verifyToken, requireRole(["Tim Legal", "Director"]));

// Routes KPR
router.get("/", KprController.getAllKpr);
router.put("/:bookingId/status", KprController.updateStatus);
router.post("/:bookingId/documents", upload.single("file"), KprController.uploadDocument);

export default router;
