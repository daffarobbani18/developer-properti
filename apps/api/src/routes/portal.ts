import { Router } from "express";
import { z } from "zod";

import { prisma } from "../db";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";
import { HttpError } from "../utils/errors";
import { readRouteParam } from "../utils/request";

const paymentUploadSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().int().positive(),
  method: z.string().min(2),
  proofUrl: z.string().url()
});

const createTicketSchema = z.object({
  category: z.string().min(2),
  subject: z.string().min(3),
  description: z.string().min(5)
});

const messageSchema = z.object({
  message: z.string().min(1),
  attachmentUrl: z.string().url().optional()
});

const getCustomerProfileOrThrow = async (userId: string) => {
  const profile = await prisma.customerProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      unit: {
        include: {
          project: true
        }
      }
    }
  });

  if (!profile) {
    throw new HttpError(404, "Profil customer tidak ditemukan");
  }

  return profile;
};

export const portalRouter = Router();

portalRouter.use(authenticate, authorize("CUSTOMER"));

portalRouter.get(
  "/overview",
  asyncHandler(async (req, res) => {
    const profile = await getCustomerProfileOrThrow(req.user!.id);

    const nextInvoice = await prisma.invoice.findFirst({
      where: {
        customerId: profile.id,
        status: {
          in: ["UNPAID", "OVERDUE", "PENDING_VERIFICATION"]
        }
      },
      orderBy: { dueDate: "asc" }
    });

    const unreadNotifications = await prisma.notification.count({
      where: {
        userId: req.user!.id,
        isRead: false
      }
    });

    res.json({
      data: {
        customer: {
          id: profile.user.id,
          fullName: profile.user.fullName,
          email: profile.user.email,
          phone: profile.user.phone
        },
        unit: profile.unit,
        nextInvoice,
        unreadNotifications
      }
    });
  })
);

portalRouter.get(
  "/progress",
  asyncHandler(async (req, res) => {
    const profile = await getCustomerProfileOrThrow(req.user!.id);

    if (!profile.unit) {
      throw new HttpError(404, "Unit customer belum terhubung");
    }

    const milestones = await prisma.unitMilestone.findMany({
      where: {
        unitId: profile.unit.id
      },
      include: {
        template: true,
        photos: {
          orderBy: {
            createdAt: "desc"
          }
        }
      },
      orderBy: {
        template: {
          orderNo: "asc"
        }
      }
    });

    res.json({
      data: {
        unit: profile.unit,
        milestones
      }
    });
  })
);

portalRouter.get(
  "/invoices",
  asyncHandler(async (req, res) => {
    const profile = await getCustomerProfileOrThrow(req.user!.id);

    const invoices = await prisma.invoice.findMany({
      where: { customerId: profile.id },
      include: {
        payments: true
      },
      orderBy: { dueDate: "desc" }
    });

    res.json({ data: invoices });
  })
);

portalRouter.post(
  "/payments/upload",
  asyncHandler(async (req, res) => {
    const payload = paymentUploadSchema.parse(req.body);
    const profile = await getCustomerProfileOrThrow(req.user!.id);

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: payload.invoiceId,
        customerId: profile.id
      }
    });

    if (!invoice) {
      throw new HttpError(404, "Tagihan tidak ditemukan");
    }

    const payment = await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: payload.amount,
        method: payload.method,
        proofUrl: payload.proofUrl
      }
    });

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: "PENDING_VERIFICATION"
      }
    });

    const financeAdmins = await prisma.user.findMany({
      where: {
        role: {
          in: ["FINANCE_ADMIN", "FINANCE_MANAGER"]
        }
      },
      select: { id: true }
    });

    if (financeAdmins.length > 0) {
      await prisma.notification.createMany({
        data: financeAdmins.map((user) => ({
          userId: user.id,
          title: "Bukti Pembayaran Baru",
          body: `Customer ${profile.user.fullName} mengunggah bukti pembayaran.`,
          type: "PAYMENT"
        }))
      });
    }

    res.status(201).json({ data: payment });
  })
);

portalRouter.get(
  "/documents",
  asyncHandler(async (req, res) => {
    const profile = await getCustomerProfileOrThrow(req.user!.id);

    if (!profile.unit) {
      res.json({ data: [] });
      return;
    }

    const documents = await prisma.legalDocument.findMany({
      where: {
        OR: [{ unitId: profile.unit.id }, { projectId: profile.unit.projectId }]
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: documents });
  })
);

portalRouter.get(
  "/tickets",
  asyncHandler(async (req, res) => {
    const profile = await getCustomerProfileOrThrow(req.user!.id);

    const tickets = await prisma.complaintTicket.findMany({
      where: {
        customerId: profile.id
      },
      orderBy: { updatedAt: "desc" }
    });

    res.json({ data: tickets });
  })
);

portalRouter.post(
  "/tickets",
  asyncHandler(async (req, res) => {
    const payload = createTicketSchema.parse(req.body);
    const profile = await getCustomerProfileOrThrow(req.user!.id);

    const ticket = await prisma.complaintTicket.create({
      data: {
        customerId: profile.id,
        category: payload.category,
        subject: payload.subject,
        description: payload.description,
        status: "NEW"
      }
    });

    const salesManagers = await prisma.user.findMany({
      where: {
        role: {
          in: ["SALES_MANAGER", "PROJECT_MANAGER"]
        }
      },
      select: { id: true }
    });

    if (salesManagers.length > 0) {
      await prisma.notification.createMany({
        data: salesManagers.map((user) => ({
          userId: user.id,
          title: "Tiket Komplain Baru",
          body: `${profile.user.fullName} membuat tiket: ${payload.subject}`,
          type: "TICKET"
        }))
      });
    }

    res.status(201).json({ data: ticket });
  })
);

portalRouter.get(
  "/tickets/:id/messages",
  asyncHandler(async (req, res) => {
    const ticketId = readRouteParam(req.params.id, "id");
    const profile = await getCustomerProfileOrThrow(req.user!.id);

    const ticket = await prisma.complaintTicket.findFirst({
      where: {
        id: ticketId,
        customerId: profile.id
      }
    });

    if (!ticket) {
      throw new HttpError(404, "Tiket tidak ditemukan");
    }

    const messages = await prisma.complaintMessage.findMany({
      where: { ticketId: ticket.id },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    res.json({ data: messages });
  })
);

portalRouter.post(
  "/tickets/:id/messages",
  asyncHandler(async (req, res) => {
    const ticketId = readRouteParam(req.params.id, "id");
    const payload = messageSchema.parse(req.body);
    const profile = await getCustomerProfileOrThrow(req.user!.id);

    const ticket = await prisma.complaintTicket.findFirst({
      where: {
        id: ticketId,
        customerId: profile.id
      }
    });

    if (!ticket) {
      throw new HttpError(404, "Tiket tidak ditemukan");
    }

    const message = await prisma.complaintMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: req.user!.id,
        message: payload.message,
        attachmentUrl: payload.attachmentUrl
      }
    });

    await prisma.complaintTicket.update({
      where: { id: ticket.id },
      data: { status: "IN_PROGRESS" }
    });

    res.status(201).json({ data: message });
  })
);

portalRouter.get("/faq", (_req, res) => {
  res.json({
    data: [
      {
        question: "Bagaimana melihat progres pembangunan unit?",
        answer: "Buka menu Progres untuk melihat milestone dan foto terbaru."
      },
      {
        question: "Bagaimana mengunggah bukti pembayaran?",
        answer: "Masuk ke menu Tagihan lalu pilih unggah bukti pada tagihan terkait."
      },
      {
        question: "Bagaimana membuat komplain?",
        answer: "Gunakan menu Bantuan > Tiket untuk membuat tiket komplain baru."
      }
    ]
  });
});
