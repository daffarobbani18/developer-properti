import { prisma } from "../database/prisma.js";

export class SalesService {
  /**
   * Mendaftarkan Lead / Prospek baru
   */
  static async createLead(data: {
    name: string;
    phone: string;
    email?: string;
    source: string;
    notes?: string;
  }) {
    return await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        source: data.source,
        notes: data.notes,
        statusCrm: "New",
      },
    });
  }

  /**
   * Mengambil data semua Lead (dengan opsi filter)
   */
  static async getAllLeads(statusCrm?: string) {
    const whereClause = statusCrm ? { statusCrm } : {};
    return await prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Membuat transaksi Booking baru menggunakan Prisma Interactive Transaction
   * Mengunci unit dan membuat record booking secara atomic
   */
  static async createBooking(data: {
    leadId: string;
    unitId: string;
    bookingFee: number;
    paymentMethod: string;
  }) {
    // Memulai transaksi database (semua berhasil atau semua gagal)
    return await prisma.$transaction(async (tx) => {
      // 1. Cari Unit berdasarkan unitId
      const unit = await tx.unit.findUnique({
        where: { id: data.unitId },
      });

      if (!unit) {
        throw new Error("Unit tidak ditemukan");
      }

      // 2. Cek apakah statusPenjualan == 'Tersedia' (kasih toleransi ke field legacy 'status' juga jika diperlukan)
      if (unit.statusPenjualan !== "Tersedia" && unit.status !== "Tersedia") {
        throw new Error("Unit sudah tidak tersedia (Booked / Terjual)");
      }

      // 3. Buat data Booking baru
      const booking = await tx.booking.create({
        data: {
          leadId: data.leadId,
          unitId: data.unitId,
          bookingFee: data.bookingFee,
          paymentMethod: data.paymentMethod,
          status: "Menunggu Verifikasi",
        },
      });

      // 4. Update statusPenjualan pada Unit menjadi 'Booked' (update juga legacy field 'status')
      await tx.unit.update({
        where: { id: data.unitId },
        data: {
          statusPenjualan: "Booked",
          status: "Booked", // Sinkronisasi field lama
        },
      });

      return booking;
    });
  }

  /**
   * Mengambil riwayat Booking
   */
  static async getAllBookings() {
    return await prisma.booking.findMany({
      include: {
        lead: {
          select: { name: true, phone: true },
        },
        unit: {
          select: { blok: true, nomor: true, kawasan: true, totalPrice: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
