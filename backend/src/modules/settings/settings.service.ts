import { prisma } from "../../core/config/prisma.js";

export class SettingsService {
  static async getActiveKprSetting() {
    return await prisma.kprSetting.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async createKprSetting(data: {
    kprYear: number;
    kprMaxPlafon: number;
    kprMinDpPercent: number;
  }) {
    // Nonaktifkan semua setting yang ada
    await prisma.kprSetting.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Buat setting baru sebagai yang aktif
    return await prisma.kprSetting.create({
      data: {
        kprYear: data.kprYear,
        kprMaxPlafon: data.kprMaxPlafon,
        kprMinDpPercent: data.kprMinDpPercent,
        isActive: true,
      },
    });
  }
}
