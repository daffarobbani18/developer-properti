import { Request, Response } from "express";
import { ConstructionService } from "./construction.service.js";

// Extend Request untuk mengambil `user` yang disisipkan oleh verifyToken middleware
interface AuthRequest extends Request {
  user?: any;
}

export class ConstructionController {
  static async recordProgress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { unitId } = req.params;
      const { percentage, description } = req.body;
      
      // Jika ada file gambar di-upload, ambil path/URL nya
      const photoUrl = req.file ? `/uploads/construction/${req.file.filename}` : undefined;

      if (!unitId || percentage === undefined || !description) {
        res.status(400).json({ error: "Data wajib (unitId, percentage, description) tidak lengkap" });
        return;
      }

      // Ambil ID user dari token (harus string UUID)
      const recordedById = req.user?.id;

      if (!recordedById) {
        res.status(401).json({ error: "Unauthorized: User ID tidak ditemukan di token" });
        return;
      }

      const progress = await ConstructionService.recordProgress({
        unitId: String(unitId),
        percentage: Number(percentage),
        description: String(description),
        photoUrl: photoUrl,
        recordedById: String(recordedById),
      });

      res.status(201).json({
        message: "Progres pembangunan lapangan berhasil dicatat",
        data: progress,
      });
    } catch (error: any) {
      if (error.message.includes("lebih kecil dari") || error.message.includes("0 hingga 100")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("recordProgress error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat mencatat progres" });
      }
    }
  }

  static async getUnitProgressHistory(req: Request, res: Response): Promise<void> {
    try {
      const { unitId } = req.params;

      if (!unitId) {
        res.status(400).json({ error: "unitId wajib disertakan" });
        return;
      }

      const history = await ConstructionService.getUnitProgressHistory(String(unitId));

      res.status(200).json({
        message: "Berhasil mengambil riwayat progres pembangunan unit",
        data: history,
      });
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan")) {
        res.status(404).json({ error: error.message });
      } else {
        console.error("getUnitProgressHistory error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server" });
      }
    }
  }

  static async createSpk(req: Request, res: Response): Promise<void> {
    try {
      const { spkNo, date, contractorName, totalPrice, unitIds } = req.body;

      const spk = await ConstructionService.createSpk({
        spkNo,
        date: new Date(date),
        contractorName,
        totalPrice: Number(totalPrice),
        unitIds,
      });

      res.status(201).json({
        message: "SPK Borongan berhasil dibuat",
        data: spk,
      });
    } catch (error: any) {
      if (error.message.includes("sudah ada") || error.message.includes("berstatus") || error.message.includes("memiliki SPK")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("createSpk error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat membuat SPK" });
      }
    }
  }

  static async getSpkList(req: Request, res: Response): Promise<void> {
    try {
      const spks = await ConstructionService.getSpkList();
      res.status(200).json({
        message: "Berhasil mengambil daftar SPK Borongan",
        data: spks,
      });
    } catch (error: any) {
      console.error("getSpkList error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  static async getSpkDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const spk = await ConstructionService.getSpkDetail(String(id));
      res.status(200).json({
        message: "Berhasil mengambil detail SPK",
        data: spk,
      });
    } catch (error: any) {
      if (error.message === "SPK tidak ditemukan") {
        res.status(404).json({ error: error.message });
      } else {
        console.error("getSpkDetail error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server" });
      }
    }
  }
}
