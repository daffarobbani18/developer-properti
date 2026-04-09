import { Router } from "express";
import { z } from "zod";

import { prisma } from "../db";
import { asyncHandler } from "../utils/async-handler";
import { readRouteParam } from "../utils/request";

const leadSchema = z.object({
  projectId: z.string().optional(),
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional(),
  source: z.string().default("website"),
  interestedUnitType: z.string().optional(),
  notes: z.string().optional()
});

const kprSchema = z.object({
  price: z.number().positive(),
  dpPercent: z.number().min(0).max(100),
  tenorYears: z.number().int().positive(),
  interestPercent: z.number().min(0)
});

export const publicRouter = Router();

publicRouter.get(
  "/projects",
  asyncHandler(async (_req, res) => {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: {
            units: true,
            leads: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: projects });
  })
);

publicRouter.get(
  "/units",
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;
    const projectSlug = req.query.projectSlug as string | undefined;

    const units = await prisma.unit.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(projectSlug
          ? {
              project: {
                slug: projectSlug
              }
            }
          : {})
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
            location: true
          }
        }
      },
      orderBy: [{ projectId: "asc" }, { code: "asc" }]
    });

    res.json({ data: units });
  })
);

publicRouter.get(
  "/units/:id",
  asyncHandler(async (req, res) => {
    const unitId = readRouteParam(req.params.id, "id");

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        project: true,
        milestones: {
          include: {
            template: true,
            photos: true
          },
          orderBy: {
            template: {
              orderNo: "asc"
            }
          }
        }
      }
    });

    if (!unit) {
      res.status(404).json({ message: "Unit tidak ditemukan" });
      return;
    }

    res.json({ data: unit });
  })
);

publicRouter.post(
  "/leads",
  asyncHandler(async (req, res) => {
    const payload = leadSchema.parse(req.body);

    const sales = await prisma.user.findFirst({
      where: { role: "SALES" },
      orderBy: { createdAt: "asc" }
    });

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
        ...(sales ? { assignedTo: { connect: { id: sales.id } } } : {})
      }
    });

    if (sales) {
      await prisma.notification.create({
        data: {
          userId: sales.id,
          title: "Leads Baru",
          body: `Lead ${payload.name} masuk dari website marketing.`,
          type: "LEAD"
        }
      });
    }

    res.status(201).json({ data: lead, message: "Leads berhasil dikirim" });
  })
);

publicRouter.post(
  "/kpr/simulate",
  asyncHandler(async (req, res) => {
    const payload = kprSchema.parse(req.body);

    const dpAmount = (payload.price * payload.dpPercent) / 100;
    const principal = payload.price - dpAmount;
    const monthlyRate = payload.interestPercent / 100 / 12;
    const installments = payload.tenorYears * 12;

    const monthlyInstallment =
      monthlyRate === 0
        ? principal / installments
        : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -installments));

    res.json({
      data: {
        price: payload.price,
        dpAmount,
        principal,
        monthlyInstallment,
        installments
      }
    });
  })
);
