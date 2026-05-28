import { prisma } from "../../core/config/prisma.js";

export class BillingService {
  /**
   * Membuat jadwal tagihan secara otomatis (generate Invoices)
   */
  static async generateInvoices(data: {
    bookingId: string;
    totalAmount: number;
    tenor: number;
    invoiceType: string;
  }) {
    // Validasi booking ada dan sudah di-approve
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      throw new Error("Booking tidak ditemukan");
    }

    if (booking.status !== "Approved") {
      throw new Error("Hanya booking dengan status Approved yang bisa dibuatkan tagihan");
    }

    // Hitung nominal per termin (pembulatan 2 desimal)
    const amountPerTermin = Math.round((data.totalAmount / data.tenor) * 100) / 100;

    return await prisma.$transaction(async (tx: any) => {
      const createdInvoices = [];
      const baseDate = new Date(); // Anggap tagihan pertama jatuh tempo 1 bulan dari sekarang

      for (let i = 1; i <= data.tenor; i++) {
        const dueDate = new Date(baseDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        // Nomor invoice format: INV-BOOKINGID-TERMIN
        const invoiceNumber = `INV-${data.bookingId.substring(0, 8).toUpperCase()}-T${i}`;

        const invoice = await tx.invoice.create({
          data: {
            bookingId: data.bookingId,
            invoiceNumber: invoiceNumber,
            invoiceType: data.invoiceType,
            amountDue: amountPerTermin,
            dueDate: dueDate,
            status: "Unpaid",
          },
        });

        createdInvoices.push(invoice);
      }

      return createdInvoices;
    });
  }

  /**
   * Mencatat pembayaran (record Payment) dan mengupdate status Invoice
   */
  static async recordPayment(data: {
    invoiceId: string;
    amountPaid: number;
    paymentMethod: string;
    referenceNumber?: string;
  }) {
    return await prisma.$transaction(async (tx: any) => {
      // 1. Cari Invoice
      const invoice = await tx.invoice.findUnique({
        where: { id: data.invoiceId },
      });

      if (!invoice) {
        throw new Error("Invoice tidak ditemukan");
      }

      if (invoice.status === "Paid") {
        throw new Error("Invoice ini sudah lunas (Paid)");
      }

      // 2. Tentukan status baru (Paid / Partial)
      // Di sistem sederhana ini, kita asumsikan jika amountPaid >= amountDue maka Paid
      let newStatus = "Unpaid";
      if (data.amountPaid >= invoice.amountDue) {
        newStatus = "Paid";
      } else if (data.amountPaid > 0) {
        newStatus = "Partial"; // Jika sistem mendukung cicilan per invoice, tapi default Unpaid/Paid
      }

      // 3. Catat Payment
      const payment = await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          amountPaid: data.amountPaid,
          paymentDate: new Date(),
          paymentMethod: data.paymentMethod,
          referenceNumber: data.referenceNumber,
          status: "Verified",
        },
      });

      // 4. Update Invoice
      await tx.invoice.update({
        where: { id: invoice.id },
        data: { status: newStatus },
      });

      return payment;
    });
  }

  /**
   * Mengambil riwayat tagihan dan pembayaran berdasarkan bookingId
   */
  static async getBillingHistory(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        invoices: {
          include: {
            payments: true,
          },
          orderBy: { dueDate: "asc" },
        },
        lead: { select: { name: true, phone: true } },
        unit: { select: { blok: true, nomor: true, kawasan: true, totalPrice: true } },
      },
    });

    if (!booking) {
      throw new Error("Booking tidak ditemukan");
    }

    // Hitung totalRemainingBalance
    let totalRemainingBalance = 0;
    booking.invoices.forEach((inv: any) => {
      if (inv.status !== "Paid") {
        totalRemainingBalance += inv.amountDue;
        
        // Kurangi dengan partial payment jika ada
        inv.payments.forEach((p: any) => {
          totalRemainingBalance -= p.amountPaid;
        });
      }
    });

    return {
      bookingDetail: {
        leadName: booking.lead.name,
        unit: `${booking.unit.kawasan} - ${booking.unit.blok}/${booking.unit.nomor}`,
        unitPrice: booking.unit.totalPrice,
      },
      totalRemainingBalance,
      invoices: booking.invoices,
    };
  }
}
