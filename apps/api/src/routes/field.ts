import { Router } from "express";
import { z } from "zod";

import { prisma } from "../db";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";
import { HttpError } from "../utils/errors";
import { readRouteParam } from "../utils/request";

const milestoneStatuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "DELAYED"] as const;
const issueStatuses = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

const milestoneUpdateSchema = z.object({
  status: z.enum(milestoneStatuses),
  note: z.string().optional(),
  actualDate: z.string().datetime().optional()
});

const photoSchema = z.object({
  photos: z.array(
    z.object({
      url: z.string().url(),
      caption: z.string().optional()
    })
  )
});

const issueSchema = z.object({
  projectId: z.string().min(1),
  unitId: z.string().optional(),
  title: z.string().min(3),
  category: z.string().min(2),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  description: z.string().min(5),
  assigneeId: z.string().optional()
});

const updateIssueSchema = z.object({
  status: z.enum(issueStatuses)
});

const updateUnitProgress = async (unitId: string): Promise<void> => {
  const milestones = await prisma.unitMilestone.findMany({ where: { unitId } });
  const completed = milestones.filter((item) => item.status === "COMPLETED").length;
  const progress = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0;

  await prisma.unit.update({
    where: { id: unitId },
    data: {
      progress
    }
  });
};

export const fieldRouter = Router();

fieldRouter.use(authenticate, authorize("SITE_ENGINEER", "PROJECT_MANAGER"));

fieldRouter.get(
  "/projects",
  asyncHandler(async (_req, res) => {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: {
            units: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: projects });
  })
);

fieldRouter.get(
  "/projects/:id/units",
  asyncHandler(async (req, res) => {
    const projectId = readRouteParam(req.params.id, "id");

    const units = await prisma.unit.findMany({
      where: { projectId },
      orderBy: { code: "asc" }
    });

    res.json({ data: units });
  })
);

fieldRouter.get(
  "/units/:id/milestones",
  asyncHandler(async (req, res) => {
    const unitId = readRouteParam(req.params.id, "id");

    const milestones = await prisma.unitMilestone.findMany({
      where: { unitId },
      include: {
        template: true,
        photos: {
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: {
        template: {
          orderNo: "asc"
        }
      }
    });

    res.json({ data: milestones });
  })
);

fieldRouter.post(
  "/milestones/:id/update",
  asyncHandler(async (req, res) => {
    const milestoneId = readRouteParam(req.params.id, "id");
    const payload = milestoneUpdateSchema.parse(req.body);

    const milestone = await prisma.unitMilestone.update({
      where: { id: milestoneId },
      data: {
        status: payload.status,
        note: payload.note,
        actualDate:
          payload.actualDate
            ? new Date(payload.actualDate)
            : payload.status === "COMPLETED"
              ? new Date()
              : undefined,
        updatedById: req.user!.id
      }
    });

    await updateUnitProgress(milestone.unitId);

    res.json({ data: milestone });
  })
);

fieldRouter.post(
  "/milestones/:id/photos",
  asyncHandler(async (req, res) => {
    const milestoneId = readRouteParam(req.params.id, "id");
    const payload = photoSchema.parse(req.body);

    const milestone = await prisma.unitMilestone.findUnique({ where: { id: milestoneId } });
    if (!milestone) {
      throw new HttpError(404, "Milestone tidak ditemukan");
    }

    const created = await prisma.milestonePhoto.createMany({
      data: payload.photos.map((photo) => ({
        unitMilestoneId: milestone.id,
        url: photo.url,
        caption: photo.caption,
        uploadedById: req.user!.id
      }))
    });

    res.status(201).json({ data: created });
  })
);

fieldRouter.get(
  "/issues",
  asyncHandler(async (req, res) => {
    const projectId = req.query.projectId as string | undefined;

    const issues = await prisma.fieldIssue.findMany({
      where: {
        ...(projectId ? { projectId } : {})
      },
      include: {
        unit: {
          select: {
            code: true,
            typeName: true
          }
        },
        project: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: issues });
  })
);

fieldRouter.post(
  "/issues",
  asyncHandler(async (req, res) => {
    const payload = issueSchema.parse(req.body);

    const issue = await prisma.fieldIssue.create({
      data: {
        title: payload.title,
        category: payload.category,
        urgency: payload.urgency,
        description: payload.description,
        status: "NEW",
        project: { connect: { id: payload.projectId } },
        ...(payload.unitId ? { unit: { connect: { id: payload.unitId } } } : {}),
        reportedBy: { connect: { id: req.user!.id } },
        ...(payload.assigneeId ? { assignee: { connect: { id: payload.assigneeId } } } : {})
      }
    });

    if (payload.assigneeId) {
      await prisma.notification.create({
        data: {
          userId: payload.assigneeId,
          title: "Kendala Lapangan Baru",
          body: `${payload.title} memerlukan tindak lanjut.`,
          type: "ISSUE"
        }
      });
    }

    res.status(201).json({ data: issue });
  })
);

fieldRouter.patch(
  "/issues/:id/status",
  asyncHandler(async (req, res) => {
    const issueId = readRouteParam(req.params.id, "id");

    if (req.user!.role !== "PROJECT_MANAGER") {
      throw new HttpError(403, "Hanya Manajer Proyek yang dapat mengubah status kendala");
    }

    const payload = updateIssueSchema.parse(req.body);

    const issue = await prisma.fieldIssue.update({
      where: { id: issueId },
      data: { status: payload.status }
    });

    res.json({ data: issue });
  })
);
