import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class KprService {
  // 1. Get all bookings with paymentMethod KPR that are approved (Booking Fee Verified)
  static async getAllKprBookings() {
    return prisma.booking.findMany({
      where: {
        paymentMethod: {
          contains: "KPR",
          mode: "insensitive"
        },
        status: {
          not: "Menunggu Verifikasi" // Asumsi sudah diverifikasi Finance
        }
      },
      include: {
        lead: true,
        unit: {
          include: {
            project: true,
            propertyType: true
          }
        },
        kprApplication: {
          include: {
            documents: true
          }
        },
        invoices: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // 2. Initialize or Update KPR Application Status
  static async updateKprStatus(bookingId: string, data: {
    status: string;
    bankName?: string;
    plafondPengajuan?: number;
    plafondDisetujui?: number;
    notes?: string;
    alasanPembatalan?: string;
    kebijakanUang?: "hanguskan" | "kembalikan";
  }) {
    // Cari booking dan invoices untuk kalkulasi
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { invoices: true, unit: true, lead: true }
    });

    if (!booking) {
      throw new Error("Booking tidak ditemukan");
    }

    let isPlafonTurun = false;
    let selisihPlafon = 0;

    // Handle Pembatalan KPR (Ditolak Bank)
    if (data.status === "Ditolak Bank / Batal") {
      return prisma.$transaction(async (tx) => {
        // 1. Update KPR Application status
        const kprApp = await tx.kprApplication.upsert({
          where: { bookingId },
          create: {
            bookingId,
            status: data.status,
            notes: data.alasanPembatalan || data.notes
          },
          update: {
            status: data.status,
            notes: data.alasanPembatalan || data.notes
          }
        });

        // 2. Update Unit status
        await tx.unit.update({
          where: { id: booking.unitId },
          data: { statusPenjualan: "Tersedia" }
        });

        // 3. Update Booking status
        const financeNotes = booking.financeNotes 
            ? booking.financeNotes + `\n[KPR Batal] Alasan: ${data.alasanPembatalan}. Kebijakan: ${data.kebijakanUang}`
            : `[KPR Batal] Alasan: ${data.alasanPembatalan}. Kebijakan: ${data.kebijakanUang}`;

        await tx.booking.update({
          where: { id: bookingId },
          data: { 
            status: "Ditolak",
            financeNotes
          }
        });

        // 4. Cancel Unpaid Invoices
        await tx.invoice.updateMany({
          where: { bookingId, status: "Unpaid" },
          data: { status: "Canceled" }
        });

        // 5. Create Expense if Refund
        if (data.kebijakanUang === "kembalikan") {
          await tx.expense.create({
            data: {
              category: "Refund Pembatalan KPR",
              amount: booking.bookingFee,
              description: `Refund Booking Fee untuk klien ${booking.lead?.name || "Klien"}. Alasan: ${data.alasanPembatalan}`,
              status: "Menunggu Transfer",
              bookingId: booking.id
            }
          });
        }

        return kprApp;
      });
    }

    // Aturan Blokir (Siap Akad)
    if (data.status === "Siap Akad") {
      const unpaidSelisih = booking.invoices.find(inv => 
        inv.invoiceType === "Selisih Plafon KPR" && inv.status !== "Paid"
      );
      if (unpaidSelisih) {
        throw new Error("Tidak dapat pindah ke Siap Akad. Tagihan Selisih Plafon KPR belum dilunasi oleh klien.");
      }
    }

    // Kalkulasi edge case Plafon Turun pada saat SP3K
    if (data.status === "SP3K Terbit" && data.plafondDisetujui !== undefined) {
      // Hitung total DP yang sudah ditagih/dibayar
      const totalDpInvoices = booking.invoices.reduce((acc, inv) => acc + inv.amountDue, 0);
      const totalPaidOrInvoicedDp = booking.bookingFee + totalDpInvoices;
      const expectedKprAmount = booking.unit.totalPrice - totalPaidOrInvoicedDp;

      if (data.plafondDisetujui < expectedKprAmount) {
        isPlafonTurun = true;
        selisihPlafon = expectedKprAmount - data.plafondDisetujui;

        // Auto-generate invoice Selisih Plafon KPR jika belum ada
        const existingInvoice = booking.invoices.find(inv => inv.invoiceType === "Selisih Plafon KPR");
        if (!existingInvoice) {
          const count = await prisma.invoice.count();
          const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(count + 1).padStart(4, "0")}`;
          
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 7); // 7 hari jatuh tempo

          await prisma.invoice.create({
            data: {
              bookingId,
              invoiceNumber,
              invoiceType: "Selisih Plafon KPR",
              amountDue: selisihPlafon,
              dueDate,
              status: "Unpaid"
            }
          });
        }
      }
    }

    // Trigger 2: Pencairan KPR Bank saat Selesai Akad
    if (data.status === "Selesai Akad") {
      const existingPencairan = booking.invoices.find(inv => inv.invoiceType === "Pencairan KPR Bank");
      if (!existingPencairan) {
        // Ambil plafond disetujui
        let approvedPlafond = data.plafondDisetujui;
        if (approvedPlafond === undefined) {
           const kprApp = await prisma.kprApplication.findUnique({ where: { bookingId } });
           approvedPlafond = kprApp?.plafondDisetujui || 0;
        }

        if (approvedPlafond && approvedPlafond > 0) {
          const count = await prisma.invoice.count();
          const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(count + 1).padStart(4, "0")}`;
          
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 7); // 7 hari pencairan

          await prisma.invoice.create({
            data: {
              bookingId,
              invoiceNumber,
              invoiceType: "Pencairan KPR Bank",
              amountDue: approvedPlafond,
              dueDate,
              status: "Unpaid"
            }
          });
        }
      }
    }

    // Upsert KPR Application
    return prisma.kprApplication.upsert({
      where: { bookingId },
      create: {
        bookingId,
        status: data.status,
        bankName: data.bankName,
        plafondPengajuan: data.plafondPengajuan || 0,
        plafondDisetujui: data.plafondDisetujui,
        notes: data.notes,
        isPlafonTurun,
        selisihPlafon
      },
      update: {
        status: data.status,
        bankName: data.bankName !== undefined ? data.bankName : undefined,
        plafondPengajuan: data.plafondPengajuan !== undefined ? data.plafondPengajuan : undefined,
        plafondDisetujui: data.plafondDisetujui !== undefined ? data.plafondDisetujui : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
        isPlafonTurun,
        selisihPlafon
      }
    });
  }

  // 3. Upload KPR Document
  static async uploadDocument(bookingId: string, data: {
    documentType: string;
    fileUrl: string;
    notes?: string;
  }) {
    // Pastikan KprApplication sudah ada, jika belum buatkan
    const kprApp = await prisma.kprApplication.upsert({
      where: { bookingId },
      create: { bookingId },
      update: {}
    });

    return prisma.kprDocument.create({
      data: {
        kprApplicationId: kprApp.id,
        documentType: data.documentType,
        fileUrl: data.fileUrl,
        notes: data.notes,
        status: "Valid"
      }
    });
  }
}
