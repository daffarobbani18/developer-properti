import { Request, Response } from "express";
import { prisma } from "../../../core/config/prisma.js";

// Helper to get the first booking for a logged in user based on email
async function getCustomerBooking(userEmail: string) {
  const lead = await prisma.lead.findFirst({
    where: { email: userEmail },
  });
  if (!lead) return null;

  const booking = await prisma.booking.findFirst({
    where: { leadId: lead.id },
    include: {
      unit: {
        include: {
          project: true,
          propertyType: true,
        },
      },
      invoices: true,
      legalDocuments: true,
      defects: true,
    },
  });
  return booking;
}

// Helper to get ALL bookings for a logged in user based on email
async function getCustomerBookingsList(userEmail: string) {
  const lead = await prisma.lead.findFirst({
    where: { email: userEmail },
  });
  if (!lead) return [];

  const bookings = await prisma.booking.findMany({
    where: { leadId: lead.id },
    include: {
      unit: {
        include: {
          project: true,
          propertyType: true,
        },
      },
      invoices: true,
      legalDocuments: true,
      defects: true,
    },
  });
  return bookings;
}

export const getUnits = async (req: Request, res: Response): Promise<void> => {
  try {
    const decoded = (req as any).user;
    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const dbUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!dbUser || !dbUser.email) {
      res.status(401).json({ error: "User email not found" });
      return;
    }

    const bookings = await getCustomerBookingsList(dbUser.email);
    const units = bookings.map(b => ({
      id: b.unit.id,
      projectId: b.unit.project.id,
      code: b.unit.nomor || b.unit.nomorUnit || "TBD",
      typeName: b.unit.propertyType.name,
      status: b.unit.status,
      progress: b.unit.progress,
    }));

    res.json({ data: units });
  } catch (error: any) {
    console.error("getUnits Error:", error);
    res.status(500).json({ error: "Gagal mengambil daftar unit" });
  }
};

export const getOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const decoded = (req as any).user;
    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    
    const dbUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!dbUser || !dbUser.email) {
      res.status(401).json({ error: "User email not found" });
      return;
    }

    const booking = await getCustomerBooking(dbUser.email);
    if (!booking) {
      res.status(404).json({ error: "Booking tidak ditemukan untuk customer ini" });
      return;
    }

    const unit = booking.unit;
    const project = unit.project;
    const propertyType = unit.propertyType;

    // Determine unread notifications (mocking to 0 since no Notification model exists yet)
    const unreadNotifications = 0;

    // Find next invoice
    const unpaidInvoices = booking.invoices.filter((i: any) => i.status !== "LUNAS");
    unpaidInvoices.sort((a: any, b: any) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
    const nextInvoice = unpaidInvoices.length > 0 ? {
      id: unpaidInvoices[0].id,
      name: unpaidInvoices[0].invoiceType,
      amount: unpaidInvoices[0].amountDue,
      dueDate: unpaidInvoices[0].dueDate?.toISOString(),
      status: unpaidInvoices[0].status === "Unpaid" ? "BELUM_BAYAR" : unpaidInvoices[0].status.toUpperCase()
    } : null;

    // Active tickets (from defects)
    const activeTicketsRaw = booking.defects.filter((d: any) => d.status !== "Selesai");
    const activeTickets = activeTicketsRaw.map((t: any) => ({
      id: t.id,
      category: "Lainnya",
      subject: "Keluhan",
      description: t.description,
      status: t.status === "Dilaporkan" ? "BARU" : (t.status === "Sedang Diperbaiki" ? "DIPROSES" : "SELESAI"),
      createdAt: t.reportedAt.toISOString(),
      photoUrls: t.photoUrl ? [t.photoUrl] : []
    }));

    res.json({
      unit: {
        id: unit.id,
        projectId: project.id,
        code: unit.nomor || unit.nomorUnit || "TBD",
        typeName: propertyType.name,
        status: unit.status,
        progress: unit.progress,
      },
      nextInvoice,
      unreadNotifications,
      activeTickets,
    });
  } catch (error: any) {
    console.error("getOverview Error:", error);
    res.status(500).json({ error: "Gagal mengambil overview customer" });
  }
};

export const getProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const decoded = (req as any).user;
    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const dbUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!dbUser || !dbUser.email) {
      res.status(401).json({ error: "User email not found" });
      return;
    }
    const unitId = req.query.unitId as string | undefined;

    const bookings = await getCustomerBookingsList(dbUser.email);
    if (bookings.length === 0) {
      res.status(404).json({ error: "Booking tidak ditemukan" });
      return;
    }

    let targetBooking = bookings[0];
    if (unitId) {
      const found = bookings.find(b => b.unit.id === unitId);
      if (found) {
        targetBooking = found;
      } else {
        res.status(404).json({ error: "Unit tidak ditemukan atau bukan milik Anda" });
        return;
      }
    }

    const milestones = await prisma.milestone.findMany({
      where: { unitId: targetBooking.unit.id },
      orderBy: { orderNo: "asc" },
      include: { logs: true }
    });

    const responseData = milestones.map((m: any) => ({
      id: m.id,
      unitId: m.unitId,
      name: m.name,
      category: m.category,
      orderNo: m.orderNo,
      targetDate: m.targetDate?.toISOString(),
      actualDate: m.actualDate?.toISOString(),
      status: m.status,
      note: m.note,
      photos: m.photoUrls.map((url: any, i: any) => ({
        id: `photo-${m.id}-${i}`,
        url,
        caption: `Foto progress ${m.name}`,
        createdAt: m.updatedAt.toISOString(),
      })),
      checklist: [],
      checklistCompleted: 0,
      checklistTotal: 0,
      logs: m.logs.map((l: any) => ({
        id: l.id,
        status: l.status,
        note: l.note,
        photoUrls: l.photoUrls,
        createdAt: l.createdAt.toISOString()
      }))
    }));

    res.json(responseData);
  } catch (error: any) {
    console.error("getProgress Error:", error);
    res.status(500).json({ error: "Gagal mengambil data progress" });
  }
};

export const getBilling = async (req: Request, res: Response): Promise<void> => {
  try {
    const decoded = (req as any).user;
    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const dbUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!dbUser || !dbUser.email) {
      res.status(401).json({ error: "User email not found" });
      return;
    }
    const booking = await getCustomerBooking(dbUser.email);
    if (!booking) {
      res.status(404).json({ error: "Booking tidak ditemukan" });
      return;
    }

    const invoicesData = await prisma.invoice.findMany({
      where: { bookingId: booking.id },
      include: { payments: true }
    });

    let totalPrice = booking.unit.totalPrice || booking.unit.price || 0;
    let paid = 0;
    
    const invoices = invoicesData.map((i: any) => {
      const sumPayments = i.payments.reduce((acc: any, p: any) => acc + p.amountPaid, 0);
      paid += sumPayments;
      
      let status = "BELUM_BAYAR";
      if (sumPayments >= i.amountDue) status = "LUNAS";
      else if (i.payments.length > 0) status = "MENUNGGU_VERIFIKASI"; // simplified logic
      else if (i.dueDate && new Date() > i.dueDate) status = "JATUH_TEMPO";

      return {
        id: i.id,
        name: i.invoiceType,
        amount: i.amountDue,
        dueDate: i.dueDate?.toISOString(),
        status
      };
    });

    const outstanding = totalPrice - paid;
    
    const paymentsRaw = await prisma.payment.findMany({
      where: { invoice: { bookingId: booking.id } }
    });
    
    const payments = paymentsRaw.map((p: any) => ({
      id: p.id,
      invoiceId: p.invoiceId,
      amount: p.amountPaid,
      method: p.paymentMethod,
      status: p.status === "Verified" ? "DIKONFIRMASI" : "MENUNGGU_VERIFIKASI",
      proofUrl: p.referenceNumber, // Storing proof URL in referenceNumber for now
      paidAt: p.paymentDate.toISOString()
    }));

    res.json({
      summary: {
        totalPrice,
        paid,
        outstanding,
        paymentScheme: booking.paymentMethod,
        monthlyInstallment: 0
      },
      invoices,
      payments
    });
  } catch (error: any) {
    console.error("getBilling Error:", error);
    res.status(500).json({ error: "Gagal mengambil data billing" });
  }
};

export const submitPaymentProof = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoiceId, amount, proofUrl } = req.body;
    
    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amountPaid: amount,
        paymentDate: new Date(),
        paymentMethod: "TRANSFER",
        referenceNumber: proofUrl,
        status: "Unverified"
      }
    });

    res.json({
      id: payment.id,
      invoiceId: payment.invoiceId,
      amount: payment.amountPaid,
      method: payment.paymentMethod,
      status: "MENUNGGU_VERIFIKASI",
      proofUrl: payment.referenceNumber,
      paidAt: payment.paymentDate.toISOString()
    });
  } catch (error: any) {
    console.error("submitPaymentProof Error:", error);
    res.status(500).json({ error: "Gagal mengirim bukti pembayaran" });
  }
};

export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const decoded = (req as any).user;
    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const dbUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!dbUser || !dbUser.email) {
      res.status(401).json({ error: "User email not found" });
      return;
    }
    const booking = await getCustomerBooking(dbUser.email);
    if (!booking) {
      res.status(404).json({ error: "Booking tidak ditemukan" });
      return;
    }

    const docs = booking.legalDocuments.map((d: any) => ({
      id: d.id,
      title: d.documentType,
      category: "Pra-pembelian", // generic
      status: d.status === "Selesai" ? "TERSEDIA" : "SEDANG_DIPROSES",
      url: d.fileUrl
    }));

    res.json(docs);
  } catch (error: any) {
    console.error("getDocuments Error:", error);
    res.status(500).json({ error: "Gagal mengambil data dokumen" });
  }
};

export const getSupportData = async (req: Request, res: Response): Promise<void> => {
  try {
    const decoded = (req as any).user;
    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const dbUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!dbUser || !dbUser.email) {
      res.status(401).json({ error: "User email not found" });
      return;
    }
    const booking = await getCustomerBooking(dbUser.email);
    if (!booking) {
      res.status(404).json({ error: "Booking tidak ditemukan" });
      return;
    }

    const tickets = booking.defects.map((d: any) => ({
      id: d.id,
      category: "Lainnya",
      subject: "Keluhan",
      description: d.description,
      status: d.status === "Dilaporkan" ? "BARU" : (d.status === "Sedang Diperbaiki" ? "DIPROSES" : "SELESAI"),
      createdAt: d.reportedAt.toISOString(),
      photoUrls: d.photoUrl ? [d.photoUrl] : []
    }));

    const faq = [
      { id: "f1", question: "Kapan rumah saya mulai dibangun?", answer: "Pembangunan dimulai setelah pembayaran DP lunas dan SPK diterbitkan." },
      { id: "f2", question: "Berapa lama proses KPR?", answer: "Normalnya 14-30 hari kerja tergantung bank." }
    ];

    res.json({ tickets, faq });
  } catch (error: any) {
    console.error("getSupportData Error:", error);
    res.status(500).json({ error: "Gagal mengambil data support" });
  }
};

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const decoded = (req as any).user;
    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const dbUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!dbUser || !dbUser.email) {
      res.status(401).json({ error: "User email not found" });
      return;
    }
    const booking = await getCustomerBooking(dbUser.email);
    if (!booking) {
      res.status(404).json({ error: "Booking tidak ditemukan" });
      return;
    }

    const { subject, description, photoUrls } = req.body;
    
    const defect = await prisma.defectComplaint.create({
      data: {
        bookingId: booking.id,
        description: `${subject} - ${description}`,
        photoUrl: photoUrls && photoUrls.length > 0 ? photoUrls[0] : null,
        status: "Dilaporkan",
      }
    });

    res.json({
      id: defect.id,
      category: "Lainnya",
      subject,
      description,
      status: "BARU",
      createdAt: defect.reportedAt.toISOString(),
      photoUrls: defect.photoUrl ? [defect.photoUrl] : []
    });
  } catch (error: any) {
    console.error("createTicket Error:", error);
    res.status(500).json({ error: "Gagal membuat tiket" });
  }
};
