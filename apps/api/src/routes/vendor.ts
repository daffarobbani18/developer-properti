import { Router } from "express";
import { z } from "zod";

import { prisma } from "../db";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";
import { HttpError } from "../utils/errors";
import { readRouteParam } from "../utils/request";

const createVendorSchema = z.object({
  name: z.string().min(2),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  serviceType: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional()
});

const createInvoiceSchema = z.object({
  vendorId: z.string().min(1),
  projectId: z.string().min(1),
  milestoneId: z.string().optional(),
  amount: z.number().int().positive(),
  description: z.string().min(3)
});

const approvalSchema = z.object({
  notes: z.string().optional()
});

const rejectionSchema = z.object({
  reason: z.string().min(3)
});

export const vendorRouter = Router();

vendorRouter.use(
  authenticate,
  authorize("DIRECTOR", "FINANCE_MANAGER", "PROJECT_MANAGER")
);

vendorRouter.get(
  "/vendors",
  asyncHandler(async (_req, res) => {
    const vendors = await prisma.vendor.findMany({
      include: {
        _count: {
          select: {
            invoices: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: vendors });
  })
);

vendorRouter.post(
  "/vendors",
  asyncHandler(async (req, res) => {
    const payload = createVendorSchema.parse(req.body);
    const vendor = await prisma.vendor.create({
      data: {
        name: payload.name,
        contactPerson: payload.contactPerson,
        phone: payload.phone,
        email: payload.email,
        serviceType: payload.serviceType,
        rating: payload.rating
      }
    });
    res.status(201).json({ data: vendor });
  })
);

vendorRouter.get(
  "/invoices",
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;

    const invoices = await prisma.vendorInvoice.findMany({
      where: {
        ...(status ? { status } : {})
      },
      include: {
        vendor: true,
        project: {
          select: {
            id: true,
            name: true
          }
        },
        milestone: {
          include: {
            template: true,
            unit: {
              select: {
                code: true,
                typeName: true
              }
            }
          }
        },
        submittedBy: {
          select: {
            fullName: true,
            role: true
          }
        },
        approvedBy: {
          select: {
            fullName: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: invoices });
  })
);

vendorRouter.post(
  "/invoices",
  asyncHandler(async (req, res) => {
    const payload = createInvoiceSchema.parse(req.body);

    if (payload.milestoneId) {
      const milestone = await prisma.unitMilestone.findUnique({
        where: { id: payload.milestoneId }
      });

      if (!milestone || milestone.status !== "COMPLETED") {
        throw new HttpError(400, "Milestone belum selesai, termin tidak dapat diajukan");
      }
    }

    const invoice = await prisma.vendorInvoice.create({
      data: {
        amount: payload.amount,
        description: payload.description,
        vendor: { connect: { id: payload.vendorId } },
        project: { connect: { id: payload.projectId } },
        ...(payload.milestoneId ? { milestone: { connect: { id: payload.milestoneId } } } : {}),
        submittedBy: { connect: { id: req.user!.id } }
      }
    });

    const financeManagers = await prisma.user.findMany({
      where: {
        role: {
          in: ["FINANCE_MANAGER", "DIRECTOR"]
        }
      },
      select: { id: true }
    });

    if (financeManagers.length > 0) {
      await prisma.notification.createMany({
        data: financeManagers.map((user) => ({
          userId: user.id,
          title: "Tagihan Termin Baru",
          body: `Tagihan termin senilai Rp${payload.amount.toLocaleString("id-ID")} menunggu approval.`,
          type: "VENDOR_APPROVAL"
        }))
      });
    }

    res.status(201).json({ data: invoice });
  })
);

vendorRouter.post(
  "/invoices/:id/approve",
  asyncHandler(async (req, res) => {
    const invoiceId = readRouteParam(req.params.id, "id");
    approvalSchema.parse(req.body);

    const invoice = await prisma.vendorInvoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) {
      throw new HttpError(404, "Tagihan vendor tidak ditemukan");
    }

    if (invoice.status !== "PENDING") {
      throw new HttpError(400, "Tagihan sudah diproses sebelumnya");
    }

    const requiresDirector = invoice.amount >= 50000000;
    if (requiresDirector && req.user!.role !== "DIRECTOR") {
      throw new HttpError(403, "Tagihan di atas Rp50 juta hanya bisa disetujui Direktur");
    }

    if (!requiresDirector && !["FINANCE_MANAGER", "DIRECTOR"].includes(req.user!.role)) {
      throw new HttpError(403, "Tagihan ini memerlukan approval Finance Manager atau Direktur");
    }

    const updated = await prisma.vendorInvoice.update({
      where: { id: invoice.id },
      data: {
        status: "APPROVED",
        approvedById: req.user!.id,
        approvedAt: new Date()
      }
    });

    if (invoice.submittedById) {
      await prisma.notification.create({
        data: {
          userId: invoice.submittedById,
          title: "Tagihan Termin Disetujui",
          body: `Tagihan termin Rp${invoice.amount.toLocaleString("id-ID")} telah disetujui.`,
          type: "VENDOR_APPROVAL"
        }
      });
    }

    res.json({ data: updated });
  })
);

vendorRouter.post(
  "/invoices/:id/reject",
  asyncHandler(async (req, res) => {
    const invoiceId = readRouteParam(req.params.id, "id");
    const payload = rejectionSchema.parse(req.body);

    const invoice = await prisma.vendorInvoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) {
      throw new HttpError(404, "Tagihan vendor tidak ditemukan");
    }

    const updated = await prisma.vendorInvoice.update({
      where: { id: invoice.id },
      data: {
        status: "REJECTED",
        approvedById: req.user!.id,
        rejectionReason: payload.reason,
        approvedAt: new Date()
      }
    });

    if (invoice.submittedById) {
      await prisma.notification.create({
        data: {
          userId: invoice.submittedById,
          title: "Tagihan Termin Ditolak",
          body: `Tagihan ditolak: ${payload.reason}`,
          type: "VENDOR_APPROVAL"
        }
      });
    }

    res.json({ data: updated });
  })
);

vendorRouter.get(
  "/invoices/:id/ba",
  asyncHandler(async (req, res) => {
    const invoiceId = readRouteParam(req.params.id, "id");

    const invoice = await prisma.vendorInvoice.findUnique({
      where: { id: invoiceId },
      include: {
        vendor: true,
        project: true,
        milestone: {
          include: {
            template: true,
            unit: true
          }
        },
        approvedBy: {
          select: {
            fullName: true,
            role: true
          }
        }
      }
    });

    if (!invoice) {
      throw new HttpError(404, "Tagihan vendor tidak ditemukan");
    }

    if (invoice.status !== "APPROVED") {
      throw new HttpError(400, "BA termin hanya tersedia untuk tagihan yang disetujui");
    }

    res.json({
      data: {
        nomor: `BA-${invoice.id.slice(-8).toUpperCase()}`,
        tanggal: invoice.approvedAt,
        proyek: invoice.project.name,
        vendor: invoice.vendor.name,
        milestone: invoice.milestone?.template.name ?? "Termin Umum",
        unit: invoice.milestone?.unit.code ?? "-",
        nilai: invoice.amount,
        disetujuiOleh: invoice.approvedBy?.fullName ?? "-",
        jabatan: invoice.approvedBy?.role ?? "-",
        catatan: invoice.description
      }
    });
  })
);
