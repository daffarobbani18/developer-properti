import { Request, Response } from "express";
import { SalesService } from "./sales.service.js";
import { prisma } from "../../core/config/prisma.js";

export class SalesController {
  static async createLead(req: Request, res: Response): Promise<void> {
    try {
      const { name, phone, email, source, notes } = req.body;

      if (!name || !phone || !source) {
        res.status(400).json({ error: "Nama, telepon, dan sumber (source) wajib diisi" });
        return;
      }

      const lead = await SalesService.createLead({
        nik: req.body.nik ? String(req.body.nik) : undefined,
        name: String(name),
        phone: String(phone),
        email: email ? String(email) : undefined,
        address: req.body.address ? String(req.body.address) : undefined,
        source: String(source),
        statusCrm: req.body.statusCrm ? String(req.body.statusCrm) : undefined,
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
      const { statusCrm, search } = req.query;
      const leads = await SalesService.getAllLeads(
        statusCrm ? String(statusCrm) : undefined,
        search ? String(search) : undefined
      );
      
      res.status(200).json({
        message: "Berhasil mengambil data prospek",
        data: leads,
      });
    } catch (error: any) {
      console.error("getAllLeads error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  static async updateLead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const lead = await SalesService.updateLead(String(id), data);
      res.status(200).json({
        message: "Lead prospek berhasil diupdate",
        data: lead,
      });
    } catch (error: any) {
      console.error("updateLead error:", error);
      res.status(500).json({ error: error.message || "Terjadi kesalahan pada server" });
    }
  }

  static async deleteLead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await SalesService.deleteLead(String(id));
      res.status(200).json({
        message: "Lead prospek berhasil dihapus",
      });
    } catch (error: any) {
      console.error("deleteLead error:", error);
      res.status(500).json({ error: error.message || "Terjadi kesalahan pada server" });
    }
  }

  static async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const { leadId, unitId, bookingFee, paymentMethod, salesNotes } = req.body;
      const salesId = (req as any).user.id;

      if (!leadId || !unitId || !bookingFee || !paymentMethod) {
        res.status(400).json({ error: "Semua parameter (leadId, unitId, bookingFee, paymentMethod) wajib diisi" });
        return;
      }

      const booking = await SalesService.createBooking({
        leadId: String(leadId),
        unitId: String(unitId),
        bookingFee: Number(bookingFee),
        paymentMethod: String(paymentMethod),
        salesNotes: salesNotes ? String(salesNotes) : undefined,
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

  // --- ACTIVITY METHODS ---

  static async createActivity(req: Request, res: Response): Promise<void> {
    try {
      // Dalam implementasi nyata, salesId didapat dari token req.user.id
      // Untuk kemudahan demo, kita ambil sementara dari dummy auth body atau hardcode ke sales dummy
      const salesId = (req as any).user?.id || (await prisma.user.findFirst({ where: { role: { name: "Sales & Marketing" } } }))?.id;
      
      const { leadId, title, type, date, status, notes } = req.body;

      if (!leadId || !title || !type || !date) {
        res.status(400).json({ error: "Data wajib tidak lengkap (leadId, title, type, date)" });
        return;
      }

      if (!salesId) {
        res.status(401).json({ error: "Unauthorized (Sales user not found)" });
        return;
      }

      const activity = await SalesService.createActivity({
        leadId: String(leadId),
        salesId: String(salesId),
        title: String(title),
        type: String(type),
        date: new Date(date),
        status: status ? String(status) : undefined,
        notes: notes ? String(notes) : undefined,
      });

      res.status(201).json({
        message: "Aktivitas berhasil ditambahkan",
        data: activity,
      });
    } catch (error: any) {
      console.error("createActivity error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  static async getActivities(req: Request, res: Response): Promise<void> {
    try {
      // Ambil salesId (sama seperti create)
      const salesId = (req as any).user?.id || (await prisma.user.findFirst({ where: { role: { name: "Sales & Marketing" } } }))?.id;
      
      if (!salesId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { status } = req.query;
      const activities = await SalesService.getActivities(salesId, status ? String(status) : undefined);
      
      res.status(200).json({
        message: "Berhasil mengambil daftar aktivitas",
        data: activities,
      });
    } catch (error: any) {
      console.error("getActivities error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  static async updateActivityStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const salesId = (req as any).user?.id || (await prisma.user.findFirst({ where: { role: { name: "Sales & Marketing" } } }))?.id;

      if (!status) {
        res.status(400).json({ error: "Status wajib diisi" });
        return;
      }

      if (!salesId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const activity = await SalesService.updateActivityStatus(String(id), salesId, String(status));
      res.status(200).json({
        message: "Status aktivitas berhasil diperbarui",
        data: activity,
      });
    } catch (error: any) {
      console.error("updateActivityStatus error:", error);
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteActivity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const salesId = (req as any).user?.id || (await prisma.user.findFirst({ where: { role: { name: "Sales & Marketing" } } }))?.id;

      if (!salesId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      await SalesService.deleteActivity(String(id), salesId);
      res.status(200).json({
        message: "Aktivitas berhasil dihapus",
      });
    } catch (error: any) {
      console.error("deleteActivity error:", error);
      res.status(400).json({ error: error.message });
    }
  }
}
