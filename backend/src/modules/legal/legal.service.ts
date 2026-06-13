import { prisma } from "../../core/config/prisma.js";

export class LegalService {
  /**
   * Mengambil semua status legal dari booking
   */
  static async getAllLegalStatuses() {
    return await prisma.booking.findMany({
      include: {
        lead: { select: { name: true } },
        unit: { select: { blok: true, nomor: true, kawasan: true, progress: true, statusPembangunan: true } },
        legalDocuments: true,
        basts: true,
        defects: true,
        invoices: true
      },
      where: {
        status: "Approved"
      },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Membuat atau mengupdate dokumen legal
   */
  static async createOrUpdateLegalDoc(data: {
    bookingId: string;
    documentType: string;
    status: string;
    fileUrl?: string;
    notes?: string;
  }) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      throw new Error("Booking tidak ditemukan");
    }

    // Cek apakah dokumen tipe ini sudah ada
    const existingDoc = await prisma.legalDocument.findFirst({
      where: {
        bookingId: data.bookingId,
        documentType: data.documentType,
      },
    });

    if (existingDoc) {
      // Update dokumen
      return await prisma.legalDocument.update({
        where: { id: existingDoc.id },
        data: {
          status: data.status,
          fileUrl: data.fileUrl || existingDoc.fileUrl,
          notes: data.notes,
          issuedAt: data.status === "Selesai" ? new Date() : existingDoc.issuedAt,
        },
      });
    } else {
      // Buat baru
      return await prisma.legalDocument.create({
        data: {
          bookingId: data.bookingId,
          documentType: data.documentType,
          status: data.status,
          fileUrl: data.fileUrl,
          notes: data.notes,
          issuedAt: data.status === "Selesai" ? new Date() : null,
        },
      });
    }
  }

  /**
   * Mengambil semua dokumen legal untuk suatu booking
   */
  static async getBookingLegalDocs(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        legalDocuments: true,
        basts: true,
      },
    });

    if (!booking) {
      throw new Error("Booking tidak ditemukan");
    }

    return {
      legalDocuments: booking.legalDocuments,
      basts: booking.basts,
    };
  }

  /**
   * Menjadwalkan Serah Terima (BAST)
   */
  static async scheduleBast(data: {
    bookingId: string;
    handoverDate: Date;
    remarks?: string;
  }) {
    // Validasi krusial: Cek status unit
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { unit: true },
    });

    if (!booking) {
      throw new Error("Booking tidak ditemukan");
    }

    if (booking.unit.progress < 100 && booking.unit.statusPembangunan !== "Siap Huni") {
      throw new Error("Rumah belum selesai dibangun, BAST tidak dapat dijadwalkan");
    }

    // Validasi ketat: Pastikan tidak ada defect yang belum selesai
    const activeDefects = await prisma.defectComplaint.count({
      where: {
        bookingId: data.bookingId,
        status: { in: ["Dilaporkan", "Sedang Diperbaiki"] }
      }
    });

    if (activeDefects > 0) {
      throw new Error("Masih ada komplain/defect yang belum selesai diperbaiki.");
    }

    // Buat jadwal BAST
    return await prisma.bast.create({
      data: {
        bookingId: data.bookingId,
        handoverDate: data.handoverDate,
        status: "Dijadwalkan",
        remarks: data.remarks,
      },
    });
  }

  /**
   * Menyelesaikan BAST
   */
  static async completeBast(data: {
    bastId: string;
    documentUrl?: string;
    remarks?: string;
  }) {
    return await prisma.$transaction(async (tx: any) => {
      // 1. Cari BAST dan Booking nya
      const bast = await tx.bast.findUnique({
        where: { id: data.bastId },
        include: { booking: true },
      });

      if (!bast) {
        throw new Error("Jadwal BAST tidak ditemukan");
      }

      if (bast.status === "Selesai") {
        throw new Error("BAST ini sudah berstatus Selesai");
      }

      // 2. Update status BAST
      const updatedBast = await tx.bast.update({
        where: { id: data.bastId },
        data: {
          status: "Selesai",
          documentUrl: data.documentUrl || bast.documentUrl,
          remarks: data.remarks || bast.remarks,
        },
      });

      // 3. Update status Penjualan Unit menjadi 'Diserahterimakan'
      await tx.unit.update({
        where: { id: bast.booking.unitId },
        data: {
          statusPenjualan: "Diserahterimakan",
        },
      });

      return updatedBast;
    });
  }

  // ==========================================
  // DEFECT COMPLAINT MANAGEMENT (MASA RETENSI)
  // ==========================================

  static async getAllDefects() {
    return await prisma.defectComplaint.findMany({
      include: {
        booking: {
          include: {
            unit: true,
            lead: true
          }
        }
      },
      orderBy: { reportedAt: "desc" }
    });
  }

  static async createDefect(data: {
    bookingId: string;
    description: string;
    photoUrl?: string;
  }) {
    return await prisma.defectComplaint.create({
      data: {
        bookingId: data.bookingId,
        description: data.description,
        photoUrl: data.photoUrl,
        status: "Dilaporkan"
      }
    });
  }

  static async updateDefectStatus(id: string, status: string) {
    const defect = await prisma.defectComplaint.findUnique({ where: { id } });
    if (!defect) throw new Error("Defect tidak ditemukan");

    return await prisma.defectComplaint.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === "Selesai" ? new Date() : defect.resolvedAt
      }
    });
  }
}
