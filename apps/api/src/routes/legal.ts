import { Router } from "express";
import { z } from "zod";

import { prisma } from "../db";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";
import { readRouteParam } from "../utils/request";

const createDocumentSchema = z.object({
  projectId: z.string().optional(),
  unitId: z.string().optional(),
  category: z.string().min(2),
  title: z.string().min(2),
  number: z.string().optional(),
  issuedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  status: z.enum(["AVAILABLE", "PROCESSING", "UNAVAILABLE", "EXPIRED"]).default("PROCESSING"),
  storageUrl: z.string().url()
});

const updateStatusSchema = z.object({
  status: z.enum(["AVAILABLE", "PROCESSING", "UNAVAILABLE", "EXPIRED"])
});

export const legalRouter = Router();

legalRouter.use(authenticate, authorize("DIRECTOR", "LEGAL_ADMIN", "PROJECT_MANAGER"));

legalRouter.get(
  "/documents",
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;
    const projectId = req.query.projectId as string | undefined;
    const unitId = req.query.unitId as string | undefined;

    const documents = await prisma.legalDocument.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(projectId ? { projectId } : {}),
        ...(unitId ? { unitId } : {})
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        unit: {
          select: {
            id: true,
            code: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: documents });
  })
);

legalRouter.post(
  "/documents",
  asyncHandler(async (req, res) => {
    const payload = createDocumentSchema.parse(req.body);

    const doc = await prisma.legalDocument.create({
      data: {
        category: payload.category,
        title: payload.title,
        number: payload.number,
        issuedAt: payload.issuedAt ? new Date(payload.issuedAt) : undefined,
        expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : undefined,
        status: payload.status,
        storageUrl: payload.storageUrl,
        ...(payload.projectId ? { project: { connect: { id: payload.projectId } } } : {}),
        ...(payload.unitId ? { unit: { connect: { id: payload.unitId } } } : {})
      }
    });

    res.status(201).json({ data: doc });
  })
);

legalRouter.patch(
  "/documents/:id/status",
  asyncHandler(async (req, res) => {
    const documentId = readRouteParam(req.params.id, "id");
    const payload = updateStatusSchema.parse(req.body);

    const doc = await prisma.legalDocument.update({
      where: { id: documentId },
      data: { status: payload.status }
    });

    res.json({ data: doc });
  })
);

legalRouter.get(
  "/monitoring",
  asyncHandler(async (_req, res) => {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const [expiring7, expiring30, expiring90] = await Promise.all([
      prisma.legalDocument.findMany({
        where: {
          expiresAt: {
            gte: now,
            lte: in7Days
          }
        },
        orderBy: { expiresAt: "asc" }
      }),
      prisma.legalDocument.findMany({
        where: {
          expiresAt: {
            gte: now,
            lte: in30Days
          }
        },
        orderBy: { expiresAt: "asc" }
      }),
      prisma.legalDocument.findMany({
        where: {
          expiresAt: {
            gte: now,
            lte: in90Days
          }
        },
        orderBy: { expiresAt: "asc" }
      })
    ]);

    res.json({
      data: {
        expiring7,
        expiring30,
        expiring90
      }
    });
  })
);
