import { prisma } from "../../core/config/prisma.js";

export class ConstructionService {
  /**
   * Mencatat progres pembangunan fisik unit kavling lapangan
   */
  static async recordProgress(data: {
    unitId: string;
    percentage: number;
    description: string;
    photoUrl?: string;
    recordedById: string;
  }) {
    if (data.percentage < 0 || data.percentage > 100) {
      throw new Error("Persentase progres harus di antara 0 hingga 100");
    }

    // Gunakan transaksi untuk mengecek dan menyimpan
    return await prisma.$transaction(async (tx: any) => {
      // 1. Dapatkan progress terbaru
      const lastProgress = await tx.constructionProgress.findFirst({
        where: { unitId: data.unitId },
        orderBy: { recordedAt: "desc" },
      });

      // Validasi: tidak boleh mundur dari progress sebelumnya
      if (lastProgress && data.percentage < lastProgress.percentage) {
        throw new Error(
          `Persentase progres (${data.percentage}%) tidak boleh lebih kecil dari progres sebelumnya (${lastProgress.percentage}%)`
        );
      }

      // 2. Simpan progres baru
      const progressRecord = await tx.constructionProgress.create({
        data: {
          unitId: data.unitId,
          percentage: data.percentage,
          description: data.description,
          photoUrl: data.photoUrl,
          recordedById: data.recordedById,
        },
      });

      // 3. Jika sudah 100%, otomatis ubah statusPembangunan di Unit menjadi "Siap Huni"
      if (data.percentage === 100) {
        await tx.unit.update({
          where: { id: data.unitId },
          data: {
            statusPembangunan: "Siap Huni",
          },
        });
      }

      return progressRecord;
    });
  }

  /**
   * Mengambil riwayat progres pembangunan dari suatu unit kavling
   */
  static async getUnitProgressHistory(unitId: string) {
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        constructionProgresses: {
          orderBy: { recordedAt: "desc" },
          include: {
            recordedBy: {
              select: { email: true, role: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!unit) {
      throw new Error("Unit tidak ditemukan");
    }

    return {
      unitDetail: {
        kawasan: unit.kawasan,
        blok: unit.blok,
        nomor: unit.nomor,
        statusPembangunan: unit.statusPembangunan,
      },
      history: unit.constructionProgresses,
    };
  }

  /**
   * Membuat SPK Borongan baru
   */
  static async createSpk(data: {
    spkNo: string;
    date: Date;
    contractorName: string;
    totalPrice: number;
    unitIds: string[];
  }) {
    // Validasi No SPK unik
    const existing = await prisma.spk.findUnique({
      where: { spkNo: data.spkNo },
    });
    if (existing) {
      throw new Error(`SPK dengan nomor ${data.spkNo} sudah ada`);
    }

    return await prisma.$transaction(async (tx: any) => {
      // 1. Validasi unit
      const units = await tx.unit.findMany({
        where: { id: { in: data.unitIds } },
        include: {
          propertyType: {
            include: { milestoneTemplates: true }
          }
        }
      });

      if (units.length !== data.unitIds.length) {
        throw new Error("Satu atau lebih unit tidak ditemukan");
      }

      for (const unit of units) {
        if (unit.spkId) {
          throw new Error(`Unit ${unit.blok} ${unit.nomor} sudah memiliki SPK`);
        }
        if (unit.statusPembangunan !== "Pesan Bangun" && unit.statusPenjualan !== "Booked") {
          throw new Error(`Unit ${unit.blok} ${unit.nomor} tidak berstatus Pesan Bangun atau Booked`);
        }
      }

      // 2. Buat SPK
      const spk = await tx.spk.create({
        data: {
          spkNo: data.spkNo,
          date: data.date,
          contractorName: data.contractorName,
          totalPrice: data.totalPrice,
        },
      });

      // 3. Update Unit
      await tx.unit.updateMany({
        where: { id: { in: data.unitIds } },
        data: {
          spkId: spk.id,
          statusPembangunan: "Sedang Dibangun",
        },
      });

      // 4. Generate Milestones for each unit
      const milestonesData: any[] = [];
      for (const unit of units) {
        if (unit.propertyType?.milestoneTemplates) {
          for (const template of unit.propertyType.milestoneTemplates) {
            milestonesData.push({
              unitId: unit.id,
              name: template.name,
              category: template.category,
              orderNo: template.orderNo,
              status: "PENDING",
              bobotPersentase: template.bobotPersentase,
            });
          }
        }
      }

      if (milestonesData.length > 0) {
        await tx.milestone.createMany({
          data: milestonesData,
        });
      }

      return spk;
    });
  }

  /**
   * Mendapatkan daftar SPK Borongan
   */
  static async getSpkList() {
    return await prisma.spk.findMany({
      orderBy: { date: "desc" },
      include: {
        units: {
          select: {
            id: true,
            blok: true,
            nomor: true,
            kawasan: true,
          },
        },
      },
    });
  }

  /**
   * Mendapatkan detail SPK
   */
  static async getSpkDetail(id: string) {
    const spk = await prisma.spk.findUnique({
      where: { id },
      include: {
        units: {
          include: {
            propertyType: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!spk) {
      throw new Error("SPK tidak ditemukan");
    }

    return spk;
  }
}
