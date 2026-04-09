import { Router } from "express";
import { z } from "zod";

import { prisma } from "../db";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

const createInvoiceSchema = z.object({
  customerId: z.string().min(1),
  unitId: z.string().optional(),
  type: z.enum(["DP", "INSTALLMENT", "KPR", "IPL", "OTHER"]),
  amount: z.number().int().positive(),
  dueDate: z.string().datetime(),
  description: z.string().optional()
});

const createPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().int().positive(),
  method: z.string().min(2),
  proofUrl: z.string().url().optional()
});

export const financeRouter = Router();

financeRouter.use(authenticate, authorize("DIRECTOR", "FINANCE_MANAGER", "FINANCE_ADMIN"));

financeRouter.get(
  "/invoices",
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;

    const invoices = await prisma.invoice.findMany({
      where: {
        ...(status ? { status } : {})
      },
      include: {
        customer: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        unit: {
          select: {
            code: true,
            typeName: true
          }
        },
        payments: true
      },
      orderBy: { dueDate: "asc" }
    });

    res.json({ data: invoices });
  })
);

financeRouter.post(
  "/invoices",
  asyncHandler(async (req, res) => {
    const payload = createInvoiceSchema.parse(req.body);

    const invoice = await prisma.invoice.create({
      data: {
        type: payload.type,
        amount: payload.amount,
        dueDate: new Date(payload.dueDate),
        description: payload.description,
        customer: { connect: { id: payload.customerId } },
        ...(payload.unitId ? { unit: { connect: { id: payload.unitId } } } : {})
      }
    });

    res.status(201).json({ data: invoice });
  })
);

financeRouter.post(
  "/payments",
  asyncHandler(async (req, res) => {
    const payload = createPaymentSchema.parse(req.body);

    const payment = await prisma.payment.create({
      data: {
        amount: payload.amount,
        method: payload.method,
        proofUrl: payload.proofUrl,
        invoice: { connect: { id: payload.invoiceId } },
        verifiedBy: { connect: { id: req.user!.id } }
      }
    });

    const invoice = await prisma.invoice.findUniqueOrThrow({
      where: { id: payload.invoiceId },
      include: { payments: true }
    });

    const paidAmount = invoice.payments.reduce((sum, item) => sum + item.amount, 0);

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: paidAmount >= invoice.amount ? "PAID" : "PENDING_VERIFICATION"
      }
    });

    res.status(201).json({ data: payment });
  })
);

financeRouter.get(
  "/cashflow",
  asyncHandler(async (_req, res) => {
    const payments = await prisma.payment.findMany();
    const approvedVendorInvoices = await prisma.vendorInvoice.findMany({
      where: { status: "APPROVED" }
    });

    const totalIncome = payments.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = approvedVendorInvoices.reduce((sum, item) => sum + item.amount, 0);

    const unpaid = await prisma.invoice.aggregate({
      where: {
        status: {
          in: ["UNPAID", "OVERDUE"]
        }
      },
      _sum: {
        amount: true
      }
    });

    res.json({
      data: {
        totalIncome,
        totalExpense,
        currentBalance: totalIncome - totalExpense,
        receivableOutstanding: unpaid._sum.amount ?? 0
      }
    });
  })
);

financeRouter.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const [invoiceCount, paidCount, overdueCount, customerCount] = await Promise.all([
      prisma.invoice.count(),
      prisma.invoice.count({ where: { status: "PAID" } }),
      prisma.invoice.count({ where: { status: "OVERDUE" } }),
      prisma.customerProfile.count()
    ]);

    res.json({
      data: {
        invoiceCount,
        paidCount,
        overdueCount,
        customerCount
      }
    });
  })
);
