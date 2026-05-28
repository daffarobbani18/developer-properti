import { Request, Response } from "express";
import { BillingService } from "./billing.service.js";

export class BillingController {
  static async generateInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId, totalAmount, tenor, invoiceType } = req.body;

      if (!bookingId || !totalAmount || !tenor || !invoiceType) {
        res.status(400).json({ error: "Data wajib (bookingId, totalAmount, tenor, invoiceType) tidak lengkap" });
        return;
      }

      const invoices = await BillingService.generateInvoices({
        bookingId: String(bookingId),
        totalAmount: Number(totalAmount),
        tenor: Number(tenor),
        invoiceType: String(invoiceType),
      });

      res.status(201).json({
        message: `Berhasil membuat jadwal tagihan sebanyak ${tenor} termin`,
        data: invoices,
      });
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan") || error.message.includes("Approved")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("generateInvoices error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat membuat tagihan" });
      }
    }
  }

  static async recordPayment(req: Request, res: Response): Promise<void> {
    try {
      const { invoiceId, amountPaid, paymentMethod, referenceNumber } = req.body;

      if (!invoiceId || !amountPaid || !paymentMethod) {
        res.status(400).json({ error: "Data wajib (invoiceId, amountPaid, paymentMethod) tidak lengkap" });
        return;
      }

      const payment = await BillingService.recordPayment({
        invoiceId: String(invoiceId),
        amountPaid: Number(amountPaid),
        paymentMethod: String(paymentMethod),
        referenceNumber: referenceNumber ? String(referenceNumber) : undefined,
      });

      res.status(201).json({
        message: "Berhasil mencatat pembayaran",
        data: payment,
      });
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan") || error.message.includes("lunas")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("recordPayment error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat mencatat pembayaran" });
      }
    }
  }

  static async getBillingHistory(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        res.status(400).json({ error: "bookingId wajib diisi di parameter" });
        return;
      }

      const history = await BillingService.getBillingHistory(String(bookingId));

      res.status(200).json({
        message: "Berhasil mengambil riwayat tagihan dan pembayaran",
        data: history,
      });
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan")) {
        res.status(404).json({ error: error.message });
      } else {
        console.error("getBillingHistory error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server" });
      }
    }
  }
}
