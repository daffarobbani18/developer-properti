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
}
