import { Router } from "express";
import { SettingsController } from "./settings.controller.js";
import { requireRole, authenticate } from "../../core/middlewares/auth.middleware.js";

const router = Router();

// Endpoint untuk mengambil aturan KPR yang aktif
// Semua user bisa melihat untuk kalkulasi
router.get("/kpr", SettingsController.getActiveKprSetting);

// Endpoint untuk membuat aturan KPR baru
// Hanya Owner/Superadmin yang bisa mengakses (auth middleware mengizinkan Owner via bypass)
router.post("/kpr", authenticate, requireRole(["Super Admin"]), SettingsController.createKprSetting);

export default router;
