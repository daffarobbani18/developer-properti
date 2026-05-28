import { Request, Response } from "express";
import { CommissionService } from "../services/commission.service.js";

export class CommissionController {
  static async calculateCommission(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId, salesUserId, percentage, notes } = req.body;

      if (!bookingId || !salesUserId || percentage === undefined) {
        res.status(400).json({ error: "Data wajib (bookingId, salesUserId, percentage) tidak lengkap" });
        return;
      }

      // Validasi batas wajar persentase komisi (misal max 5%)
      const parsedPercentage = Number(percentage);
      if (parsedPercentage <= 0 || parsedPercentage > 5) {
        res.status(400).json({ error: "Persentase komisi tidak valid. Maksimal 5%." });
        return;
      }

      const commission = await CommissionService.calculateCommission({
        bookingId: String(bookingId),
        salesUserId: String(salesUserId),
        percentage: parsedPercentage,
        notes: notes ? String(notes) : undefined,
      });

      res.status(201).json({
        message: "Komisi berhasil dihitung dan dicatat dengan status Pending",
        data: commission,
      });
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan") || error.message.includes("Approved")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("calculateCommission error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat menghitung komisi" });
      }
    }
  }

  static async approveCommission(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      if (!id) {
        res.status(400).json({ error: "id komisi wajib disertakan" });
        return;
      }

      const commission = await CommissionService.approveCommission(String(id), notes ? String(notes) : undefined);

      res.status(200).json({
        message: "Komisi berhasil disetujui (Approved)",
        data: commission,
      });
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan") || error.message.includes("Pending")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("approveCommission error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat menyetujui komisi" });
      }
    }
  }

  static async disburseCommission(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: "id komisi wajib disertakan" });
        return;
      }

      const commission = await CommissionService.disburseCommission(String(id));

      res.status(200).json({
        message: "Dana komisi berhasil dicairkan (Paid)",
        data: commission,
      });
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan") || error.message.includes("disetujui")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("disburseCommission error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat mencairkan dana" });
      }
    }
  }

  static async getAllCommissions(req: Request, res: Response): Promise<void> {
    try {
      const { salesUserId, status } = req.query;

      const filter: any = {};
      if (salesUserId) filter.salesUserId = String(salesUserId);
      if (status) filter.status = String(status);

      const commissions = await CommissionService.getAllCommissions(filter);

      res.status(200).json({
        message: "Berhasil mengambil data komisi",
        data: commissions,
      });
    } catch (error: any) {
      console.error("getAllCommissions error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server saat mengambil data komisi" });
    }
  }
}
