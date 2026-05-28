import { z } from "zod";

export const createLeadDto = z.object({
  body: z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    phone: z.string().min(1, "Nomor telepon wajib diisi"),
    email: z.string().email("Email tidak valid").optional(),
    source: z.string().min(1, "Sumber prospek wajib diisi"),
    notes: z.string().optional(),
  }),
});

export const createBookingDto = z.object({
  body: z.object({
    leadId: z.string().uuid("leadId harus berupa UUID"),
    unitId: z.string().uuid("unitId harus berupa UUID"),
    bookingFee: z.number().positive("Booking fee harus lebih dari 0"),
    paymentMethod: z.string().min(1, "Metode pembayaran wajib diisi"),
  }),
});
