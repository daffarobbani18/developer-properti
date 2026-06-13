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
  const id = req.params.id as string;
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

// GET BAPP HTML
export const generateBapp = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const spkData = await prisma.spk.findUnique({
      where: { id },
      include: {
        units: true
      }
    });

    if (!spkData) {
      return res.status(404).send("SPK tidak ditemukan.");
    }

    const html = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Berita Acara Penyelesaian Pekerjaan</title>
        <style>
          body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 40px; color: #000; max-width: 800px; margin: auto; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .header h2 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
          .header p { margin: 5px 0 0 0; font-size: 14px; }
          .title { font-size: 18px; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 30px; }
          .content { margin-bottom: 30px; text-align: justify; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          td { padding: 5px; vertical-align: top; }
          .signature-box { display: flex; justify-content: space-between; margin-top: 60px; text-align: center; }
          .sign-area { height: 100px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Griya Persada</h2>
          <p>Jl. Pembangunan No. 123, Kota, Telp. (021) 1234567</p>
        </div>
        <div class="title">BERITA ACARA PENYELESAIAN PEKERJAAN (BAPP)</div>
        <div class="content">
          <p>Pada hari ini, tanggal <strong>${new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</strong>, yang bertanda tangan di bawah ini:</p>
          <table>
            <tr><td width="200">Nama (Pihak Pertama)</td><td width="10">:</td><td><strong>Manajemen Griya Persada</strong></td></tr>
            <tr><td>Nama (Pihak Kedua)</td><td>:</td><td><strong>${spkData.contractorName}</strong></td></tr>
            <tr><td>Nomor SPK</td><td>:</td><td><strong>${spkData.spkNo}</strong></td></tr>
          </table>
          <p>Menyatakan bahwa Pihak Kedua telah <strong>MENYELESAIKAN 100%</strong> seluruh pekerjaan konstruksi sesuai dengan Surat Perintah Kerja (SPK) yang disepakati untuk unit-unit berikut:</p>
          <ul>
            ${spkData.units.map((u: any) => `<li>Kavling Blok ${u.blok} Nomor ${u.nomor}</li>`).join('')}
          </ul>
          <p>Adapun kewajiban pembayaran dari Pihak Pertama kepada Pihak Kedua telah dilunasi sepenuhnya sebesar <strong>Rp ${Number(spkData.totalPrice).toLocaleString("id-ID")}</strong> sesuai dengan nilai kontrak kesepakatan.</p>
          <p>Demikian Berita Acara Penyelesaian Pekerjaan ini dibuat dalam keadaan sadar dan tanpa paksaan dari pihak mana pun, untuk dapat dipergunakan sebagaimana mestinya.</p>
        </div>
        <div class="signature-box">
          <div>
            <p>Pihak Pertama,</p>
            <div class="sign-area"></div>
            <p><strong>( ______________________ )</strong><br/>Griya Persada</p>
          </div>
          <div>
            <p>Pihak Kedua,</p>
            <div class="sign-area"></div>
            <p><strong>( ______________________ )</strong><br/>${spkData.contractorName}</p>
          </div>
        </div>
        <script>setTimeout(() => window.print(), 500);</script>
      </body>
      </html>
    `;
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error("Error generating BAPP:", error);
    res.status(500).send("Terjadi kesalahan server saat generate BAPP.");
  }
};
