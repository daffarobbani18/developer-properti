import { Request, Response } from "express";
import { FinanceService } from "../services/finance.service.js";

export class FinanceController {
  static async getPendingBookings(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await FinanceService.getPendingBookings();
      res.status(200).json({
        message: "Berhasil mengambil antrean booking yang menunggu verifikasi",
        data: bookings,
      });
    } catch (error: any) {
      console.error("getPendingBookings error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  static async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { action, financeNotes } = req.body;

      if (!action || (action !== "Approve" && action !== "Reject")) {
        res.status(400).json({ error: "Parameter action harus berupa 'Approve' atau 'Reject'" });
        return;
      }

      const verifiedBooking = await FinanceService.verifyPayment({
        bookingId: String(id),
        action: action,
        financeNotes: financeNotes ? String(financeNotes) : undefined,
      });

      if (action === "Approve") {
        res.status(200).json({
          message: "Pembayaran disetujui, PDF Kuitansi telah diterbitkan",
          data: verifiedBooking,
        });
      } else {
        res.status(200).json({
          message: "Pembayaran ditolak, unit dikembalikan menjadi Tersedia",
          data: verifiedBooking,
        });
      }
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan") || error.message.includes("tidak bisa diverifikasi")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("verifyPayment error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat verifikasi" });
      }
    }
  }
}
