import { prisma } from "../database/prisma.js";

export class CommissionService {
  /**
   * Menghitung dan menyimpan komisi baru
   */
  static async calculateCommission(data: {
    bookingId: string;
    salesUserId: string;
    percentage: number;
    notes?: string;
  }) {
    // 1. Dapatkan Booking beserta Unit-nya untuk mengetahui harga
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { unit: true },
    });

    if (!booking) {
      throw new Error("Booking tidak ditemukan");
    }

    if (booking.status !== "Approved") {
      throw new Error("Komisi hanya dapat dihitung jika status Booking telah di-Approve oleh Finance");
    }

    // 2. Kalkulasi nominal (Harga Unit * Persentase / 100)
    const nominalAmount = Math.round((booking.unit.totalPrice * data.percentage) / 100);

    // 3. Simpan ke database
    return await prisma.commission.create({
      data: {
        bookingId: data.bookingId,
        salesUserId: data.salesUserId,
        percentage: data.percentage,
        nominalAmount: nominalAmount,
        status: "Pending",
        notes: data.notes,
      },
    });
  }

  /**
   * Menyetujui pencairan komisi (oleh Director/Management)
   */
  static async approveCommission(commissionId: string, notes?: string) {
    const commission = await prisma.commission.findUnique({
      where: { id: commissionId },
    });

    if (!commission) {
      throw new Error("Data komisi tidak ditemukan");
    }

    if (commission.status !== "Pending") {
      throw new Error("Hanya komisi berstatus Pending yang dapat disetujui");
    }

    return await prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: "Approved",
        approvedAt: new Date(),
        notes: notes || commission.notes,
      },
    });
  }

  /**
   * Mencairkan dana komisi (oleh Finance)
   */
  static async disburseCommission(commissionId: string) {
    // Karena kita tidak memiliki tabel Kas, kita ubah status menggunakan transaksi
    return await prisma.$transaction(async (tx) => {
      const commission = await tx.commission.findUnique({
        where: { id: commissionId },
      });

      if (!commission) {
        throw new Error("Data komisi tidak ditemukan");
      }

      if (commission.status !== "Approved") {
        throw new Error("Komisi harus disetujui (Approved) sebelum dicairkan");
      }

      return await tx.commission.update({
        where: { id: commissionId },
        data: {
          status: "Paid",
          disbursedAt: new Date(),
        },
      });
    });
  }

  /**
   * Mendapatkan daftar semua komisi
   */
  static async getAllCommissions(filter?: { salesUserId?: string; status?: string }) {
    return await prisma.commission.findMany({
      where: {
        salesUserId: filter?.salesUserId,
        status: filter?.status,
      },
      include: {
        salesUser: { select: { email: true, role: { select: { name: true } } } },
        booking: {
          include: {
            unit: { select: { kawasan: true, blok: true, nomor: true } },
            lead: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
