import { Router } from "express";
import { z } from "zod";

import { prisma } from "../db";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";
import { HttpError } from "../utils/errors";
import { readRouteParam } from "../utils/request";

const createProjectSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  location: z.string().min(3),
  description: z.string().optional()
});

const updateMilestoneSchema = z.object({
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
  note: z.string().optional(),
  targetDate: z.string().datetime().optional(),
  actualDate: z.string().datetime().optional()
});

const addPhotoSchema = z.object({
  url: z.string().url(),
  caption: z.string().optional()
});

const createIssueSchema = z.object({
  projectId: z.string().min(1),
  unitId: z.string().optional(),
  title: z.string().min(3),
  category: z.string().min(2),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  description: z.string().min(5),
  assigneeId: z.string().optional()
});

const updateIssueSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]),
  assigneeId: z.string().optional()
});

const projectRoles = ["DIRECTOR", "PROJECT_MANAGER", "SITE_ENGINEER"] as const;

const updateUnitProgress = async (unitId: string): Promise<void> => {
  const milestones = await prisma.unitMilestone.findMany({ where: { unitId } });
  const completed = milestones.filter((item) => item.status === "COMPLETED").length;
  const progress = milestones.length ? Math.round((completed / milestones.length) * 100) : 0;

  await prisma.unit.update({
    where: { id: unitId },
    data: { progress }
  });
};

export const projectRouter = Router();

projectRouter.use(authenticate, authorize(...projectRoles));

projectRouter.get(
  "/projects",
  asyncHandler(async (_req, res) => {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: {
            units: true,
            issues: true,
            vendorInvoices: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: projects });
  })
);

projectRouter.post(
  "/projects",
  authorize("DIRECTOR", "PROJECT_MANAGER"),
  asyncHandler(async (req, res) => {
    const payload = createProjectSchema.parse(req.body);
    const project = await prisma.project.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        location: payload.location,
        description: payload.description
      }
    });
    res.status(201).json({ data: project });
  })
);

projectRouter.get(
  "/projects/:id/units",
  asyncHandler(async (req, res) => {
    const projectId = readRouteParam(req.params.id, "id");

    const units = await prisma.unit.findMany({
      where: { projectId },
      include: {
        milestones: {
          include: {
            template: true
          },
          orderBy: {
            template: {
              orderNo: "asc"
            }
          }
        }
      },
      orderBy: { code: "asc" }
    });

    res.json({ data: units });
  })
);

projectRouter.get(
  "/units/:unitId/milestones",
  asyncHandler(async (req, res) => {
    const unitId = readRouteParam(req.params.unitId, "unitId");

    const milestones = await prisma.unitMilestone.findMany({
      where: { unitId },
      include: {
        template: true,
        photos: true,
        updatedBy: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
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

projectRouter.patch(
  "/milestones/:id",
  asyncHandler(async (req, res) => {
    const milestoneId = readRouteParam(req.params.id, "id");
    const payload = updateMilestoneSchema.parse(req.body);

    const milestone = await prisma.unitMilestone.update({
      where: { id: milestoneId },
      data: {
        status: payload.status,
        note: payload.note,
        targetDate: payload.targetDate ? new Date(payload.targetDate) : undefined,
        actualDate:
          payload.actualDate
            ? new Date(payload.actualDate)
            : payload.status === "COMPLETED"
              ? new Date()
              : undefined,
        updatedById: req.user!.id
      },
      include: {
        unit: {
          select: {
            id: true,
            code: true,
            customerProfile: {
              include: {
                user: true
              }
            }
          }
        },
        template: true
      }
    });

    await updateUnitProgress(milestone.unitId);

    if (payload.status === "COMPLETED" && milestone.unit.customerProfile?.userId) {
      await prisma.notification.create({
        data: {
          userId: milestone.unit.customerProfile.userId,
          title: "Update Progres Unit",
          body: `Milestone ${milestone.template.name} unit ${milestone.unit.code} telah selesai.`,
          type: "PROGRESS"
        }
      });
    }

    res.json({ data: milestone });
  })
);

projectRouter.post(
  "/milestones/:id/photos",
  asyncHandler(async (req, res) => {
    const milestoneId = readRouteParam(req.params.id, "id");
    const payload = addPhotoSchema.parse(req.body);

    const milestone = await prisma.unitMilestone.findUnique({ where: { id: milestoneId } });
    if (!milestone) {
      throw new HttpError(404, "Milestone tidak ditemukan");
    }

    const photo = await prisma.milestonePhoto.create({
      data: {
        unitMilestoneId: milestone.id,
        url: payload.url,
        caption: payload.caption,
        uploadedById: req.user!.id
      }
    });

    res.status(201).json({ data: photo });
  })
);

projectRouter.get(
  "/issues",
  asyncHandler(async (req, res) => {
    const projectId = req.query.projectId as string | undefined;
    const status = req.query.status as string | undefined;

    const issues = await prisma.fieldIssue.findMany({
      where: {
        ...(projectId ? { projectId } : {}),
        ...(status ? { status } : {})
      },
      include: {
        project: true,
        unit: true,
        reportedBy: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        },
        assignee: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: issues });
  })
);

projectRouter.post(
  "/issues",
  asyncHandler(async (req, res) => {
    const payload = createIssueSchema.parse(req.body);

    const issue = await prisma.fieldIssue.create({
      data: {
        title: payload.title,
        category: payload.category,
        urgency: payload.urgency,
        description: payload.description,
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
          title: "Kendala Baru",
          body: `${payload.title} membutuhkan tindak lanjut.`,
          type: "ISSUE"
        }
      });
    }

    res.status(201).json({ data: issue });
  })
);

projectRouter.patch(
  "/issues/:id",
  asyncHandler(async (req, res) => {
    const issueId = readRouteParam(req.params.id, "id");
    const payload = updateIssueSchema.parse(req.body);

    const issue = await prisma.fieldIssue.update({
      where: { id: issueId },
      data: {
        status: payload.status,
        assigneeId: payload.assigneeId
      }
    });

    if (issue.status === "RESOLVED" && issue.assigneeId) {
      await prisma.notification.create({
        data: {
          userId: issue.assigneeId,
          title: "Kendala Selesai",
          body: "Satu laporan kendala telah ditandai selesai.",
          type: "ISSUE"
        }
      });
    }

    res.json({ data: issue });
  })
);

projectRouter.get(
  "/project-manager/tickets",
  authorize("DIRECTOR", "PROJECT_MANAGER"),
  asyncHandler(async (_req, res) => {
    const tickets = await prisma.complaintTicket.findMany({
      where: {
        status: {
          in: ["NEW", "IN_PROGRESS"]
        }
      },
      include: {
        customer: {
          include: {
            user: {
              select: {
                fullName: true
              }
            }
          }
        }
      }
    });

    res.json({ data: tickets });
  })
);
