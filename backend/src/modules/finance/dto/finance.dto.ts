import { z } from "zod";

export const verifyPaymentDto = z.object({
  body: z.object({
    action: z.enum(["Approve", "Reject"]),
    financeNotes: z.string().optional(),
    receiptUrl: z.string().optional(),
  }),
});
