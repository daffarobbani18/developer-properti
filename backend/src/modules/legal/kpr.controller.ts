import { Request, Response } from "express";
import { KprService } from "./kpr.service.js";

export class KprController {
  // 1. Get All KPR Bookings
  static async getAllKpr(req: Request, res: Response) {
    try {
      const kprList = await KprService.getAllKprBookings();
      res.json(kprList);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // 2. Update Status KPR
  static async updateStatus(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const { status, bankName, plafondPengajuan, plafondDisetujui, notes } = req.body;
      
      const updated = await KprService.updateKprStatus(bookingId, {
        status,
        bankName,
        plafondPengajuan: plafondPengajuan ? Number(plafondPengajuan) : undefined,
        plafondDisetujui: plafondDisetujui ? Number(plafondDisetujui) : undefined,
        notes
      });
      
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // 3. Upload Dokumen KPR
  static async uploadDocument(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const { documentType, notes } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "File dokumen wajib diunggah" });
      }

      const fileUrl = `/uploads/legal/${file.filename}`;
      const doc = await KprService.uploadDocument(bookingId, {
        documentType,
        fileUrl,
        notes
      });

      res.status(201).json(doc);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
