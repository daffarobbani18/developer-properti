import { z } from "zod";

export const reportQueryDto = z.object({
  query: z.object({
    startDate: z.string().datetime("Format startDate tidak valid (ISO-8601)").optional(),
    endDate: z.string().datetime("Format endDate tidak valid (ISO-8601)").optional(),
  }),
});
