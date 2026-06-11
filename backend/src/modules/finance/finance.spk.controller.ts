import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get list of SPKs with Unit info, Progress, Total Price, Total Disbursed
export const getSpkList = async (req: Request, res: Response) => {
  try {
    const spks = await prisma.spk.findMany({
      include: {
        units: {
          select: {
            id: true,
            kawasan: true,
            blok: true,
            nomor: true,
            progress: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const spkWithCalculations = spks.map(spk => {
      // Menghitung rata-rata progres unit dalam SPK ini
      const totalUnits = spk.units.length;
      const avgProgress = totalUnits > 0 
        ? Math.round(spk.units.reduce((sum, unit) => sum + unit.progress, 0) / totalUnits) 
        : 0;
      
      const totalPrice = Number(spk.totalPrice);
      // @ts-ignore - mengabaikan typescript jika prisma generate belum sukses total
      const totalDisbursed = Number(spk.totalDisbursed || 0);
      const remainingBalance = totalPrice - totalDisbursed;

      return {
        id: spk.id,
        spkNo: spk.spkNo,
        date: spk.date,
        contractorName: spk.contractorName,
        totalPrice,
        totalDisbursed,
        remainingBalance,
        avgProgress,
        units: spk.units
      };
    });

    res.status(200).json({ success: true, data: spkWithCalculations });
  } catch (error: any) {
    console.error("Error fetching SPK List for Finance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST Disbursement
export const disburseSpk = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nominal, notes } = req.body;

  try {
    if (!nominal || isNaN(Number(nominal)) || Number(nominal) <= 0) {
      return res.status(400).json({ success: false, message: "Nominal pencairan tidak valid." });
    }

    const disbursementAmount = Number(nominal);

    // Dapatkan data SPK untuk validasi sisa dana
    const spkData = await prisma.spk.findUnique({ where: { id } });
    if (!spkData) {
      return res.status(404).json({ success: false, message: "SPK tidak ditemukan." });
    }

    const totalPrice = Number(spkData.totalPrice);
    // @ts-ignore
    const totalDisbursed = Number(spkData.totalDisbursed || 0);
    const remainingBalance = totalPrice - totalDisbursed;

    // VALIDASI BACKEND: Tidak boleh melebihi sisa dana (Sesuai instruksi User)
    if (disbursementAmount > remainingBalance) {
      return res.status(400).json({ 
        success: false, 
        message: `Pencairan ditolak. Nominal pencairan (Rp ${disbursementAmount.toLocaleString('id-ID')}) melebihi sisa dana SPK yang tersedia (Rp ${remainingBalance.toLocaleString('id-ID')}).` 
      });
    }

    // Eksekusi ACID Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Catat ke tabel Expense sebagai Kas Keluar (Status: Sudah Ditransfer)
      const expense = await tx.expense.create({
        data: {
          category: "Biaya Proyek",
          amount: disbursementAmount,
          description: notes || `Pencairan Termin / Kasbon Mandor untuk SPK ${spkData.spkNo}`,
          status: "Sudah Ditransfer",
          // @ts-ignore
          spkId: spkData.id
        }
      });

      // 2. Update akumulasi pencairan di tabel SPK
      const updatedSpk = await tx.spk.update({
        where: { id },
        data: {
          // @ts-ignore
          totalDisbursed: { increment: disbursementAmount }
        }
      });

      return { expense, updatedSpk };
    });

    res.status(200).json({ 
      success: true, 
      message: "Pencairan dana berhasil diproses.", 
      data: result 
    });
  } catch (error: any) {
    console.error("Error processing SPK disbursement:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server saat memproses pencairan dana." });
  }
};
