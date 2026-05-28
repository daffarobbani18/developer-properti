import { z } from "zod";

export const calculateCommissionDto = z.object({
  body: z.object({
    bookingId: z.string().uuid("bookingId harus berupa UUID"),
    salesUserId: z.string().uuid("salesUserId harus berupa UUID"),
    percentage: z.number().positive("Persentase harus lebih dari 0").max(5, "Persentase maksimal 5%"),
    notes: z.string().optional(),
  }),
});

export const approveCommissionDto = z.object({
  body: z.object({
    notes: z.string().optional(),
  }),
});
