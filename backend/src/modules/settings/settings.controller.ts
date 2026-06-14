import { Request, Response } from "express";
import { SettingsService } from "./settings.service.js";

export class SettingsController {
  static async getActiveKprSetting(req: Request, res: Response): Promise<void> {
    try {
      const setting = await SettingsService.getActiveKprSetting();
      if (!setting) {
        // Jika belum ada, kembalikan data kosong atau default
        res.status(200).json({ data: null });
        return;
      }
      res.status(200).json({ data: setting });
    } catch (error: any) {
      console.error("getActiveKprSetting error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  static async createKprSetting(req: Request, res: Response): Promise<void> {
    try {
      const { kprYear, kprMaxPlafon, kprMinDpPercent } = req.body;

      if (!kprYear || !kprMaxPlafon || !kprMinDpPercent) {
        res.status(400).json({ error: "Tahun, Maksimal Plafon, dan Minimal DP wajib diisi" });
        return;
      }

      const setting = await SettingsService.createKprSetting({
        kprYear: Number(kprYear),
        kprMaxPlafon: Number(kprMaxPlafon),
        kprMinDpPercent: Number(kprMinDpPercent),
      });

      res.status(201).json({
        message: "Pengaturan KPR berhasil diperbarui",
        data: setting,
      });
    } catch (error: any) {
      console.error("createKprSetting error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }
}
