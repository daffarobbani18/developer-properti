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
}
