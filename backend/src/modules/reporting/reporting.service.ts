import { prisma } from "../../core/config/prisma.js";

export class ReportingService {
  /**
   * Mengambil statistik Inventory (Unit Kavling)
   */
  static async getInventoryStats() {
    const stats = await prisma.unit.groupBy({
      by: ["statusPenjualan"],
      _count: {
        statusPenjualan: true,
      },
    });

    const result = {
      Tersedia: 0,
      Booked: 0,
      Terjual: 0,
      Diserahterimakan: 0,
    };

    stats.forEach((item) => {
      if (item.statusPenjualan in result) {
        result[item.statusPenjualan as keyof typeof result] = item._count.statusPenjualan;
      }
    });

    return result;
  }

  /**
   * Mengambil statistik Keuangan (Total Pendapatan dari Payment)
   */
  static async getFinancialStats(startDate?: string, endDate?: string) {
    const whereClause: any = {
      status: "Verified",
    };

    if (startDate || endDate) {
      whereClause.paymentDate = {};
      if (startDate) {
        whereClause.paymentDate.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.paymentDate.lte = new Date(endDate);
      }
    }

    const totalRevenue = await prisma.payment.aggregate({
      where: whereClause,
      _sum: {
        amountPaid: true,
      },
    });

    return {
      totalRevenue: totalRevenue._sum.amountPaid || 0,
    };
  }

  /**
   * Mengambil performa Sales (Jumlah Booking Approved per bulan)
   */
  static async getSalesPerformance(startDate?: string, endDate?: string) {
    const whereClause: any = {
      status: "Approved",
    };

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt.lte = new Date(endDate);
      }
    }

    // Mengambil semua data booking yang approved pada rentang tanggal, 
    // lalu di-group manual per bulan-tahun agar kompatibel di berbagai database
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      select: {
        createdAt: true,
      },
    });

    const performanceMap = new Map<string, number>();
    
    bookings.forEach((booking) => {
      // Format YYYY-MM
      const date = new Date(booking.createdAt);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      
      performanceMap.set(key, (performanceMap.get(key) || 0) + 1);
    });

    // Urutkan dari bulan terlama
    const sortedPerformance = Array.from(performanceMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({ month, totalApproved: count }));

    return sortedPerformance;
  }
}
