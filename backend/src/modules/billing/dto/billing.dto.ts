import { z } from "zod";

export const generateInvoiceDto = z.object({
  body: z.object({
    bookingId: z.string().uuid("bookingId harus berupa UUID"),
    totalAmount: z.number().positive("Total tagihan harus lebih dari 0"),
    tenor: z.number().int().positive("Tenor harus lebih dari 0"),
    invoiceType: z.string().min(1, "Tipe invoice wajib diisi"),
  }),
});

export const recordPaymentDto = z.object({
  body: z.object({
    invoiceId: z.string().uuid("invoiceId harus berupa UUID"),
    amountPaid: z.number().positive("Jumlah pembayaran harus lebih dari 0"),
    paymentMethod: z.string().min(1, "Metode pembayaran wajib diisi"),
    referenceNumber: z.string().optional(),
    notes: z.string().optional(),
  }),
});
