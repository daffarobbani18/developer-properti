import { Router } from "express";
import { z } from "zod";

import { prisma } from "../db";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";
import { HttpError } from "../utils/errors";
import { readRouteParam } from "../utils/request";

const leadStatuses = ["NEW", "FOLLOW_UP", "SURVEY", "NEGOTIATION", "BOOKING", "SPK", "CLOSED"] as const;
const unitStatuses = ["AVAILABLE", "BOOKED", "SOLD", "INDENT"] as const;

const createLeadSchema = z.object({
  projectId: z.string().optional(),
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional(),
  source: z.string().min(2),
  interestedUnitType: z.string().optional(),
  notes: z.string().optional(),
  assignedToId: z.string().optional()
});

const updateStatusSchema = z.object({
  status: z.enum(leadStatuses),
  note: z.string().optional()
});

const assignLeadSchema = z.object({
  assignedToId: z.string().min(1)
});

const updateUnitSchema = z.object({
  status: z.enum(unitStatuses)
});

const createTransactionSchema = z.object({
  leadId: z.string().min(1),
  unitId: z.string().min(1),
  paymentScheme: z.string().min(2),
  bookingFee: z.number().int().nonnegative().default(0),
  kprStatus: z.string().optional(),
  spkDocumentUrl: z.string().url().optional()
});

export const crmRouter = Router();

crmRouter.use(authenticate, authorize("DIRECTOR", "SALES_MANAGER", "SALES"));

crmRouter.get(
  "/leads",
  asyncHandler(async (req, res) => {
    const search = (req.query.search as string | undefined)?.trim();
    const status = req.query.status as string | undefined;
    const source = req.query.source as string | undefined;

    const leads = await prisma.lead.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { phone: { contains: search } },
                { email: { contains: search } }
              ]
            }
          : {}),
        ...(status ? { status } : {}),
        ...(source ? { source: { contains: source } } : {})
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        },
        unit: {
          select: {
            id: true,
            code: true,
            typeName: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: leads });
  })
);

crmRouter.post(
  "/leads",
  asyncHandler(async (req, res) => {
    const payload = createLeadSchema.parse(req.body);

    const lead = await prisma.lead.create({
      data: {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        source: payload.source,
        interestedUnitType: payload.interestedUnitType,
        notes: payload.notes,
        status: "NEW",
        ...(payload.projectId ? { project: { connect: { id: payload.projectId } } } : {}),
        ...(payload.assignedToId ? { assignedTo: { connect: { id: payload.assignedToId } } } : {})
      }
    });

    if (payload.assignedToId) {
      await prisma.notification.create({
        data: {
          userId: payload.assignedToId,
          title: "Leads Ditugaskan",
          body: `Anda menerima lead baru: ${payload.name}`,
          type: "LEAD"
        }
      });
    }

    res.status(201).json({ data: lead });
  })
);

crmRouter.patch(
  "/leads/:id/status",
  asyncHandler(async (req, res) => {
    const leadId = readRouteParam(req.params.id, "id");
    const payload = updateStatusSchema.parse(req.body);

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: payload.status,
        notes: payload.note
      }
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        userId: req.user!.id,
        activityType: "STATUS_UPDATE",
        note: payload.note ?? `Status diubah ke ${payload.status}`
      }
    });

    res.json({ data: lead });
  })
);

crmRouter.patch(
  "/leads/:id/assign",
  asyncHandler(async (req, res) => {
    const leadId = readRouteParam(req.params.id, "id");
    const payload = assignLeadSchema.parse(req.body);

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data: {
        assignedToId: payload.assignedToId
      }
    });

    await prisma.notification.create({
      data: {
        userId: payload.assignedToId,
        title: "Lead Baru Ditugaskan",
        body: `Lead ${updated.name} telah ditugaskan ke Anda.`,
        type: "LEAD"
      }
    });

    res.json({ data: updated });
  })
);

crmRouter.get(
  "/pipeline",
  asyncHandler(async (_req, res) => {
    const grouped = await prisma.lead.groupBy({
      by: ["status"],
      _count: {
        status: true
      }
    });

    res.json({ data: grouped });
  })
);

crmRouter.get(
  "/units",
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;

    const units = await prisma.unit.findMany({
      where: {
        ...(status ? { status } : {})
      },
      include: {
        project: true
      },
      orderBy: [{ projectId: "asc" }, { code: "asc" }]
    });

    res.json({ data: units });
  })
);

crmRouter.patch(
  "/units/:id/status",
  asyncHandler(async (req, res) => {
    const unitId = readRouteParam(req.params.id, "id");
    const payload = updateUnitSchema.parse(req.body);

    const unit = await prisma.unit.update({
      where: { id: unitId },
      data: { status: payload.status }
    });

    res.json({ data: unit });
  })
);

crmRouter.post(
  "/transactions",
  asyncHandler(async (req, res) => {
    const payload = createTransactionSchema.parse(req.body);

    const lead = await prisma.lead.findUnique({ where: { id: payload.leadId } });
    if (!lead) {
      throw new HttpError(404, "Lead tidak ditemukan");
    }

    const existingTransaction = await prisma.saleTransaction.findUnique({
      where: { unitId: payload.unitId }
    });

    if (existingTransaction) {
      throw new HttpError(400, "Unit sudah memiliki transaksi penjualan");
    }

    const transaction = await prisma.saleTransaction.create({
      data: {
        paymentScheme: payload.paymentScheme,
        bookingFee: payload.bookingFee,
        kprStatus: payload.kprStatus,
        spkDocumentUrl: payload.spkDocumentUrl,
        lead: { connect: { id: payload.leadId } },
        unit: { connect: { id: payload.unitId } }
      }
    });

    await prisma.lead.update({
      where: { id: payload.leadId },
      data: {
        status: "SPK",
        unitId: payload.unitId
      }
    });

    await prisma.unit.update({
      where: { id: payload.unitId },
      data: {
        status: payload.paymentScheme.toUpperCase().includes("KPR") ? "BOOKED" : "SOLD"
      }
    });

    res.status(201).json({ data: transaction });
  })
);

crmRouter.get(
  "/activities",
  asyncHandler(async (req, res) => {
    const leadId = req.query.leadId as string | undefined;

    const activities = await prisma.leadActivity.findMany({
      where: {
        ...(leadId ? { leadId } : {})
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        },
        lead: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { activityAt: "desc" }
    });

    res.json({ data: activities });
  })
);
