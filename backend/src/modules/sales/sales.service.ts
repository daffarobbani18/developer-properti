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
    termins?: {
      nominal: number;
      triggerType: string;
      triggerEvent?: string;
      dueDate?: string;
    }[];
  }) {
    // 0. Fetch Active KPR Settings if paymentMethod is KPR Subsidi
    let kprPlafonSnapshot: number | null = null;
    let kprHargaSubsidiSnapshot: number | null = null;
    let kprDpPercentageSnapshot: number | null = null;

    if (data.paymentMethod.includes("KPR")) {
      const activeSetting = await prisma.kprSetting.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });
      if (activeSetting) {
        kprHargaSubsidiSnapshot = activeSetting.kprMaxPlafon;
        kprDpPercentageSnapshot = activeSetting.kprMinDpPercent;
        kprPlafonSnapshot = activeSetting.kprMaxPlafon - (activeSetting.kprMaxPlafon * activeSetting.kprMinDpPercent / 100);
      }
    }

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

      // 3. Buat data Booking baru dengan snapshot
      const booking = await tx.booking.create({
        data: {
          leadId: data.leadId,
          unitId: data.unitId,
          bookingFee: data.bookingFee,
          paymentMethod: data.paymentMethod,
          salesNotes: data.salesNotes,
          status: "Menunggu Verifikasi",
          kprPlafonSnapshot,
          kprHargaSubsidiSnapshot,
          kprDpPercentageSnapshot,
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

      // 5. Buat Invoices (Termin) dengan status Draft jika ada termins
      if (data.termins && data.termins.length > 0) {
        let index = 1;
        for (const termin of data.termins) {
          await tx.invoice.create({
            data: {
              bookingId: booking.id,
              invoiceNumber: `INV-${Date.now()}-${index}`,
              invoiceType: data.paymentMethod.includes("KPR") ? "Cicilan DP" : "Cash Bertahap",
              amountDue: Number(termin.nominal),
              dueDate: termin.dueDate ? new Date(termin.dueDate) : null,
              triggerType: termin.triggerType || "DATE",
              triggerEvent: termin.triggerEvent || null,
              status: "Draft",
            },
          });
          index++;
        }
      }

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
