import { Request, Response } from "express";
import { SalesService } from "../services/sales.service.js";

export class SalesController {
  static async createLead(req: Request, res: Response): Promise<void> {
    try {
      const { name, phone, email, source, notes } = req.body;

      if (!name || !phone || !source) {
        res.status(400).json({ error: "Nama, telepon, dan sumber (source) wajib diisi" });
        return;
      }

      const lead = await SalesService.createLead({
        name: String(name),
        phone: String(phone),
        email: email ? String(email) : undefined,
        source: String(source),
        notes: notes ? String(notes) : undefined,
      });

      res.status(201).json({
        message: "Lead prospek berhasil didaftarkan",
        data: lead,
      });
    } catch (error: any) {
      console.error("createLead error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  static async getAllLeads(req: Request, res: Response): Promise<void> {
    try {
      const { statusCrm } = req.query;
      const leads = await SalesService.getAllLeads(statusCrm ? String(statusCrm) : undefined);
      
      res.status(200).json({
        message: "Berhasil mengambil data prospek",
        data: leads,
      });
    } catch (error: any) {
      console.error("getAllLeads error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  static async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const { leadId, unitId, bookingFee, paymentMethod } = req.body;

      if (!leadId || !unitId || !bookingFee || !paymentMethod) {
        res.status(400).json({ error: "Data wajib (leadId, unitId, bookingFee, paymentMethod) tidak lengkap" });
        return;
      }

      const booking = await SalesService.createBooking({
        leadId: String(leadId),
        unitId: String(unitId),
        bookingFee: Number(bookingFee),
        paymentMethod: String(paymentMethod),
      });

      res.status(201).json({
        message: "Booking berhasil dibuat dan unit telah dikunci",
        data: booking,
      });
    } catch (error: any) {
      if (error.message.includes("tidak tersedia") || error.message.includes("tidak ditemukan")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("createBooking error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat memproses transaksi" });
      }
    }
  }

  static async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await SalesService.getAllBookings();
      res.status(200).json({
        message: "Berhasil mengambil riwayat booking",
        data: bookings,
      });
    } catch (error: any) {
      console.error("getAllBookings error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }
}
