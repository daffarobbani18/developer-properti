import { Request, Response } from "express";
import { FinanceService } from "./finance.service.js";

export class FinanceController {
  static async getBookings(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.query;
      const bookings = await FinanceService.getBookings(status ? String(status) : undefined);
      res.status(200).json({
        message: "Berhasil mengambil riwayat booking",
        data: bookings,
      });
    } catch (error: any) {
      console.error("getBookings error:", error);
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

  static async getInvoicesByBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const invoices = await FinanceService.getInvoicesByBooking(String(id));
      res.status(200).json({
        message: "Berhasil mengambil daftar tagihan",
        data: invoices,
      });
    } catch (error: any) {
      console.error("getInvoicesByBooking error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  static async createInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { mode, invoiceType, nominal, dueDate, tenor, startDate } = req.body;

      if (!mode || !invoiceType) {
        res.status(400).json({ error: "Parameter mode dan invoiceType wajib diisi" });
        return;
      }

      const result = await FinanceService.createInvoices({
        bookingId: String(id),
        mode,
        invoiceType,
        nominal: nominal ? Number(nominal) : undefined,
        dueDate,
        tenor: tenor ? Number(tenor) : undefined,
        startDate,
      });

      res.status(201).json({
        message: "Berhasil men-generate tagihan",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async receivePayment(req: Request, res: Response): Promise<void> {
    try {
      const { invoiceId } = req.params;
      const { amountPaid, paymentMethod, referenceNumber } = req.body;

      if (!amountPaid || !paymentMethod) {
        res.status(400).json({ error: "Parameter amountPaid dan paymentMethod wajib diisi" });
        return;
      }

      const result = await FinanceService.receivePayment(String(invoiceId), {
        amountPaid: Number(amountPaid),
        paymentMethod,
        referenceNumber,
      });

      res.status(200).json({
        message: "Pembayaran berhasil diverifikasi",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getExpenses(req: Request, res: Response): Promise<void> {
    try {
      const expenses = await FinanceService.getExpenses();
      res.status(200).json({
        message: "Berhasil mengambil daftar pengeluaran",
        data: expenses,
      });
    } catch (error: any) {
      console.error("getExpenses error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  static async updateExpenseStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        res.status(400).json({ error: "Status wajib diisi" });
        return;
      }
      
      const updatedExpense = await FinanceService.updateExpenseStatus(String(id), status);
      res.status(200).json({
        message: "Status pengeluaran berhasil diperbarui",
        data: updatedExpense,
      });
    } catch (error: any) {
      console.error("updateExpenseStatus error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }
}
