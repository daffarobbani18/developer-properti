import { prisma } from "../../core/config/prisma.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export class FinanceService {
  /**
   * Mengambil daftar booking dengan filter status opsional
   */
  static async getBookings(status?: string) {
    const whereClause: any = {};
    if (status && status !== "Semua") {
      whereClause.status = status;
    }
    
    return await prisma.booking.findMany({
      where: whereClause,
      include: {
        lead: {
          select: { name: true, phone: true, email: true },
        },
        unit: {
          select: { blok: true, nomor: true, kawasan: true, totalPrice: true },
        },
        invoices: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Memproses verifikasi pembayaran (Approve / Reject)
   * Menggunakan Prisma Interactive Transaction untuk Approve
   */
  static async verifyPayment(data: {
    bookingId: string;
    action: "Approve" | "Reject";
    financeNotes?: string;
  }) {
    // Cari booking terlebih dahulu
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { lead: true, unit: true },
    });

    if (!booking) {
      throw new Error("Booking tidak ditemukan");
    }

    if (booking.status !== "Menunggu Verifikasi") {
      throw new Error(`Booking tidak bisa diverifikasi karena statusnya saat ini adalah ${booking.status}`);
    }

    if (data.action === "Reject") {
      // Logic REJECT: kembalikan status unit ke 'Tersedia' dan booking ke 'Ditolak'
      return await prisma.$transaction(async (tx: any) => {
        const rejectedBooking = await tx.booking.update({
          where: { id: data.bookingId },
          data: {
            status: "Ditolak",
            financeNotes: data.financeNotes,
          },
        });

        await tx.unit.update({
          where: { id: booking.unitId },
          data: {
            statusPenjualan: "Tersedia",
            status: "Tersedia",
          },
        });

        return rejectedBooking;
      });
    } else if (data.action === "Approve") {
      // Logic APPROVE: set status unit ke 'Terjual' dan booking ke 'Approved'
      return await prisma.$transaction(async (tx: any) => {
        // Buat PDF Kuitansi
        const receiptUrl = await FinanceService.generateReceiptPDF(booking);

        const approvedBooking = await tx.booking.update({
          where: { id: data.bookingId },
          data: {
            status: "Approved",
            verifiedAt: new Date(),
            receiptUrl: receiptUrl,
            financeNotes: data.financeNotes,
          },
        });

        await tx.unit.update({
          where: { id: booking.unitId },
          data: {
            statusPenjualan: "Terjual",
            status: "Terjual",
          },
        });

        return approvedBooking;
      });
    }

    throw new Error("Action tidak dikenali. Gunakan Approve atau Reject.");
  }

  /**
   * Fungsi utilitas untuk men-generate file PDF kuitansi (Receipt)
   */
  static async generateReceiptPDF(booking: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const publicDir = path.join(process.cwd(), "public");
        const uploadsDir = path.join(publicDir, "uploads");
        const receiptsDir = path.join(uploadsDir, "receipts");
        
        // Buat folder jika belum ada
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
        if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir);

        const fileName = `receipt-${booking.id}.pdf`;
        const filePath = path.join(receiptsDir, fileName);

        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Header Kuitansi
        doc.fontSize(20).text("KUITANSI PEMBAYARAN", { align: "center" });
        doc.moveDown();
        
        // Detail Perusahaan & Tanggal
        doc.fontSize(12).text(`Tanggal Terbit: ${new Date().toLocaleDateString("id-ID")}`);
        doc.text(`ID Booking: ${booking.id}`);
        doc.moveDown();

        // Data Pembeli
        doc.fontSize(14).text("Telah Terima Dari:");
        doc.fontSize(12).text(`Nama   : ${booking.lead?.name || "-"}`);
        doc.text(`No. HP : ${booking.lead?.phone || "-"}`);
        doc.moveDown();

        // Data Unit
        doc.fontSize(14).text("Untuk Pembayaran:");
        doc.fontSize(12).text(`Booking Fee Unit Kavling - Kawasan ${booking.unit?.kawasan || "-"}`);
        doc.text(`Blok / Nomor : ${booking.unit?.blok || "-"} / ${booking.unit?.nomor || "-"}`);
        doc.text(`Metode Bayar : ${booking.paymentMethod}`);
        doc.moveDown();

        // Nominal
        doc.fontSize(16).text(`Total Booking Fee: Rp ${booking.bookingFee.toLocaleString("id-ID")}`, { underline: true });
        
        doc.moveDown(3);
        doc.fontSize(10).text("Terima kasih atas kepercayaan Anda kepada kami.", { align: "center" });
        doc.text("Kuitansi ini dicetak secara otomatis dan sah tanpa tanda tangan basah.", { align: "center" });

        doc.end();

        writeStream.on("finish", () => {
          // Return URL relatif yang bisa diakses dari frontend/static router
          resolve(`/uploads/receipts/${fileName}`); // karena di index.ts kita menggunakan express.static("public", "uploads") -> wait, index.ts uses app.use("/uploads", express.static("public/uploads")) ? Let's check index.ts to be sure. It says path.join(process.cwd(), "public", "uploads"). We might need to adjust folder!
        });

        writeStream.on("error", (err) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Mengambil detail Invoices dan Payments untuk sebuah Booking
   */
  static async getInvoicesByBooking(bookingId: string) {
    return await prisma.invoice.findMany({
      where: { bookingId },
      include: {
        payments: true,
      },
      orderBy: { dueDate: "asc" },
    });
  }

  /**
   * Membangun Invoices (Tagihan Lanjutan)
   */
  static async createInvoices(data: {
    bookingId: string;
    mode: "Manual" | "Auto-Split";
    invoiceType: string;
    nominal?: number;
    dueDate?: string;
    tenor?: number;
    startDate?: string;
  }) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { unit: true, invoices: true },
    });

    if (!booking) throw new Error("Booking tidak ditemukan");

    if (data.mode === "Manual") {
      if (!data.nominal || !data.dueDate) throw new Error("Nominal dan Tanggal Jatuh Tempo wajib diisi untuk mode Manual");
      
      const count = await prisma.invoice.count();
      const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(count + 1).padStart(4, "0")}`;
      
      return await prisma.invoice.create({
        data: {
          bookingId: data.bookingId,
          invoiceNumber,
          invoiceType: data.invoiceType,
          amountDue: data.nominal,
          dueDate: new Date(data.dueDate),
          status: "Unpaid",
        },
      });
    } else if (data.mode === "Auto-Split") {
      if (!data.tenor || !data.startDate) throw new Error("Tenor dan Tanggal Mulai wajib diisi untuk mode Auto-Split");
      
      // Calculate remaining balance
      const totalPaidOrInvoiced = booking.bookingFee + booking.invoices.reduce((acc, inv) => acc + inv.amountDue, 0);
      const remainingBalance = booking.unit.totalPrice - totalPaidOrInvoiced;
      
      if (remainingBalance <= 0) throw new Error("Sisa kewajiban sudah Rp 0. Tidak ada tagihan yang bisa digenerate.");

      const monthlyAmount = remainingBalance / data.tenor;
      const invoicesToCreate = [];
      const baseDate = new Date(data.startDate);

      for (let i = 0; i < data.tenor; i++) {
        const count = await prisma.invoice.count() + i;
        const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(count + 1).padStart(4, "0")}`;
        
        const dueDate = new Date(baseDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        invoicesToCreate.push({
          bookingId: data.bookingId,
          invoiceNumber,
          invoiceType: `${data.invoiceType} - Bulan ke-${i + 1}`,
          amountDue: monthlyAmount,
          dueDate,
          status: "Unpaid",
        });
      }

      await prisma.invoice.createMany({
        data: invoicesToCreate,
      });

      return { message: `${data.tenor} Invoice berhasil di-generate` };
    }
  }

  /**
   * Menerima pembayaran untuk suatu Invoice
   */
  static async receivePayment(invoiceId: string, data: { amountPaid: number; paymentMethod: string; referenceNumber?: string }) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) throw new Error("Invoice tidak ditemukan");
    if (invoice.status === "Paid") throw new Error("Invoice ini sudah lunas");

    return await prisma.$transaction(async (tx: any) => {
      const payment = await tx.payment.create({
        data: {
          invoiceId,
          amountPaid: data.amountPaid,
          paymentDate: new Date(),
          paymentMethod: data.paymentMethod,
          referenceNumber: data.referenceNumber,
          status: "Verified",
        },
      });

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: "Paid" },
      });

      return { payment, invoice: updatedInvoice };
    });
  }
}
