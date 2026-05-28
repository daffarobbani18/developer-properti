import { Request, Response } from "express";
import { LegalService } from "./legal.service.js";

export class LegalController {
  static async getAllLegalStatuses(req: Request, res: Response): Promise<void> {
    try {
      const statuses = await LegalService.getAllLegalStatuses();
      res.status(200).json({ message: "Berhasil mengambil semua status legal", data: statuses });
    } catch (error: any) {
      res.status(500).json({ error: "Gagal mengambil data legal" });
    }
  }

  static async createOrUpdateLegalDoc(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId, documentType, status, notes } = req.body;
      
      // Jika ada file scan dokumen di-upload
      const fileUrl = req.file ? `/uploads/legal/${req.file.filename}` : undefined;

      if (!bookingId || !documentType || !status) {
        res.status(400).json({ error: "Data wajib (bookingId, documentType, status) tidak lengkap" });
        return;
      }

      const doc = await LegalService.createOrUpdateLegalDoc({
        bookingId: String(bookingId),
        documentType: String(documentType),
        status: String(status),
        fileUrl: fileUrl,
        notes: notes ? String(notes) : undefined,
      });

      res.status(200).json({
        message: "Dokumen legal berhasil direkam/diperbarui",
        data: doc,
      });
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan")) {
        res.status(404).json({ error: error.message });
      } else {
        console.error("createOrUpdateLegalDoc error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server" });
      }
    }
  }

  static async getBookingLegalDocs(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        res.status(400).json({ error: "bookingId wajib diisi" });
        return;
      }

      const docs = await LegalService.getBookingLegalDocs(String(bookingId));

      res.status(200).json({
        message: "Berhasil mengambil riwayat dokumen legal",
        data: docs,
      });
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan")) {
        res.status(404).json({ error: error.message });
      } else {
        console.error("getBookingLegalDocs error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server" });
      }
    }
  }

  static async scheduleBast(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId, handoverDate, remarks } = req.body;

      if (!bookingId || !handoverDate) {
        res.status(400).json({ error: "Data wajib (bookingId, handoverDate) tidak lengkap" });
        return;
      }

      const bast = await LegalService.scheduleBast({
        bookingId: String(bookingId),
        handoverDate: new Date(handoverDate),
        remarks: remarks ? String(remarks) : undefined,
      });

      res.status(201).json({
        message: "Berhasil menjadwalkan Serah Terima (BAST)",
        data: bast,
      });
    } catch (error: any) {
      if (error.message.includes("belum selesai dibangun") || error.message.includes("tidak ditemukan")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("scheduleBast error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat menjadwalkan BAST" });
      }
    }
  }

  static async completeBast(req: Request, res: Response): Promise<void> {
    try {
      const { bastId } = req.params;
      const { remarks } = req.body;

      // Jika ada upload file PDF BAST yang ditandatangani
      const documentUrl = req.file ? `/uploads/legal/${req.file.filename}` : undefined;

      if (!bastId) {
        res.status(400).json({ error: "bastId wajib disertakan" });
        return;
      }

      const bast = await LegalService.completeBast({
        bastId: String(bastId),
        documentUrl: documentUrl,
        remarks: remarks ? String(remarks) : undefined,
      });

      res.status(200).json({
        message: "Proses Serah Terima (BAST) Selesai. Status kavling kini Diserahterimakan.",
        data: bast,
      });
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan") || error.message.includes("sudah berstatus")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("completeBast error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat menyelesaikan BAST" });
      }
    }
  }
}
