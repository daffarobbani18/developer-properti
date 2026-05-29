import { prisma } from "../../core/config/prisma.js";

export class SalesService {
  /**
   * Mendaftarkan Lead / Prospek baru
   */
  static async createLead(data: {
    nik?: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    source: string;
    statusCrm?: string;
    notes?: string;
  }) {
    return await prisma.lead.create({
      data: {
        nik: data.nik,
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        source: data.source,
        notes: data.notes,
        statusCrm: data.statusCrm || "New",
      },
    });
  }

  /**
   * Mengambil data semua Lead (dengan opsi filter)
   */
  static async getAllLeads(statusCrm?: string, search?: string) {
    const whereClause: any = {};
    if (statusCrm && statusCrm !== "Semua") {
      whereClause.statusCrm = statusCrm;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    return await prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateLead(id: string, data: any) {
    return await prisma.lead.update({
      where: { id },
      data,
    });
  }

  static async deleteLead(id: string) {
    return await prisma.lead.delete({
      where: { id },
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
    salesNotes?: string;
  }) {
    // Memulai transaksi database (semua berhasil atau semua gagal)
    return await prisma.$transaction(async (tx: any) => {
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
          salesNotes: data.salesNotes,
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

  // --- ACTIVITY METHODS ---

  static async createActivity(data: {
    leadId: string;
    salesId: string;
    title: string;
    type: string;
    date: Date;
    status?: string;
    notes?: string;
  }) {
    return await prisma.activity.create({
      data: {
        leadId: data.leadId,
        salesId: data.salesId,
        title: data.title,
        type: data.type,
        date: data.date,
        status: data.status || "Pending",
        notes: data.notes,
      },
      include: {
        lead: {
          select: { name: true, phone: true }
        }
      }
    });
  }

  static async getActivities(salesId: string, status?: string) {
    const whereClause: any = { salesId };
    
    if (status && status !== "Semua") {
      whereClause.status = status;
    }
    
    return await prisma.activity.findMany({
      where: whereClause,
      include: {
        lead: {
          select: { name: true, phone: true, statusCrm: true }
        }
      },
      orderBy: { date: "asc" }
    });
  }

  static async updateActivityStatus(id: string, salesId: string, status: string) {
    // Memastikan aktivitas tersebut milik sales yang login
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new Error("Aktivitas tidak ditemukan");
    if (activity.salesId !== salesId) throw new Error("Unauthorized to update this activity");

    return await prisma.activity.update({
      where: { id },
      data: { status },
    });
  }

  static async deleteActivity(id: string, salesId: string) {
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new Error("Aktivitas tidak ditemukan");
    if (activity.salesId !== salesId) throw new Error("Unauthorized to delete this activity");

    return await prisma.activity.delete({
      where: { id },
    });
  }
}
