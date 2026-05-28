import { z } from "zod";

export const recordProgressDto = z.object({
  body: z.object({
    percentage: z.coerce.number().int().min(0).max(100, "Persentase harus antara 0-100"),
    description: z.string().min(1, "Keterangan wajib diisi"),
  }),
});
