import { z } from "zod";

export const createLegalDocDto = z.object({
  body: z.object({
    bookingId: z.string().uuid("bookingId harus berupa UUID"),
    documentType: z.string().min(1, "documentType wajib diisi (PPJB, AJB, dll)"),
    status: z.string().min(1, "status wajib diisi (Diproses, Selesai)"),
    notes: z.string().optional(),
  }),
});

export const scheduleBastDto = z.object({
  body: z.object({
    bookingId: z.string().uuid("bookingId harus berupa UUID"),
    handoverDate: z.string().min(1, "Tanggal serah terima tidak valid"),
    remarks: z.string().optional(),
  }),
});

export const completeBastDto = z.object({
  body: z.object({
    remarks: z.string().optional(),
  }),
});
