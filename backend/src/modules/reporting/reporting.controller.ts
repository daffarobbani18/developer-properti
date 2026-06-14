import { Request, Response } from "express";
import { ReportingService } from "./reporting.service.js";

export class ReportingController {
  static async getDashboardSummary(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };

      // Menjalankan ketiga query secara paralel untuk efisiensi
      const [inventoryStats, financialStats, salesPerformance, leadsStats, legalStats, projectStats] = await Promise.all([
        ReportingService.getInventoryStats(),
        ReportingService.getFinancialStats(startDate, endDate),
        ReportingService.getSalesPerformance(startDate, endDate),
        ReportingService.getLeadsStats(),
        ReportingService.getLegalStats(),
        ReportingService.getProjectStats(),
      ]);

      res.status(200).json({
        inventoryStats,
        financialStats,
        salesPerformance,
        leadsStats,
        legalStats,
        projectStats,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "Gagal mengambil data reporting",
        details: error.message,
      });
    }
  }
}
