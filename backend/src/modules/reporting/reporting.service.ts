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
   * Mengambil statistik Keuangan (Total Pendapatan, Pengeluaran, Tagihan Tertunda)
   */
  static async getFinancialStats(startDate?: string, endDate?: string) {
    const paymentWhere: any = { status: "Verified" };
    const expenseWhere: any = { status: "Sudah Ditransfer" };
    const invoiceWhere: any = { status: { in: ["Unpaid", "Overdue"] } };

    if (startDate || endDate) {
      if (startDate) {
        paymentWhere.paymentDate = { ...paymentWhere.paymentDate, gte: new Date(startDate) };
        expenseWhere.updatedAt = { ...expenseWhere.updatedAt, gte: new Date(startDate) };
      }
      if (endDate) {
        paymentWhere.paymentDate = { ...paymentWhere.paymentDate, lte: new Date(endDate) };
        expenseWhere.updatedAt = { ...expenseWhere.updatedAt, lte: new Date(endDate) };
      }
    }

    const [totalRevenue, totalExpense, pendingInvoices, kprBookings] = await Promise.all([
      prisma.payment.aggregate({ where: paymentWhere, _sum: { amountPaid: true } }),
      prisma.expense.aggregate({ where: expenseWhere, _sum: { amount: true } }),
      prisma.invoice.aggregate({ where: invoiceWhere, _sum: { amountDue: true } }),
      prisma.booking.findMany({
        where: {
          paymentMethod: { contains: "KPR" },
          status: { not: "Ditolak" }
        },
        include: {
          unit: true,
          invoices: true,
          kprApplication: true
        }
      })
    ]);

    const revenue = totalRevenue._sum.amountPaid || 0;
    const expense = totalExpense._sum.amount || 0;

    let piutangKpr = 0;
    kprBookings.forEach(b => {
      // Jika KPR sudah dicairkan (Selesai Akad / Pencairan Selesai dsb) idealnya ada status khusus.
      // Untuk saat ini asumsikan KPR yang belum Selesai Akad = piutang KPR.
      // Nominal KPR = Harga Jual - Total Tagihan (DP)
      const totalInvoices = b.invoices.reduce((sum, inv) => sum + inv.amountDue, 0);
      const expectedKpr = b.unit.totalPrice - totalInvoices;
      if (expectedKpr > 0 && b.kprApplication?.status !== "Selesai Akad") {
        piutangKpr += expectedKpr;
      }
    });

    return {
      totalRevenue: revenue,
      totalExpense: expense,
      cashflow: revenue - expense,
      outstandingInvoices: pendingInvoices._sum.amountDue || 0,
      piutangDeveloper: pendingInvoices._sum.amountDue || 0,
      piutangKpr: piutangKpr,
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

  /**
   * Mengambil statistik CRM Leads
   */
  static async getLeadsStats() {
    const stats = await prisma.lead.groupBy({
      by: ["statusCrm"],
      _count: { statusCrm: true },
    });

    let totalLeads = 0;
    const leadsByStatus: Record<string, number> = {};

    stats.forEach(item => {
      totalLeads += item._count.statusCrm;
      leadsByStatus[item.statusCrm] = item._count.statusCrm;
    });

    return { totalLeads, leadsByStatus };
  }

  /**
   * Mengambil statistik Legal & Purna Jual
   */
  static async getLegalStats() {
    const [kprStats, defectStats] = await Promise.all([
      prisma.kprApplication.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.defectComplaint.count({
        where: { status: { not: "Selesai" } }
      })
    ]);

    const kprPipeline: Record<string, number> = {};
    kprStats.forEach(item => {
      kprPipeline[item.status] = item._count.status;
    });

    return {
      kprPipeline,
      activeDefects: defectStats
    };
  }

  /**
   * Mengambil statistik Proyek
   */
  static async getProjectStats() {
    const activeProjects = await prisma.project.count({
      where: { status: { in: ["perencanaan", "konstruksi", "finishing"] } }
    });

    return { activeProjects };
  }
}
