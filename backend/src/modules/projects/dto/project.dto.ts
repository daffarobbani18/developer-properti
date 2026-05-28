import { z } from "zod";

export const createProjectDto = z.object({
  body: z.object({
    name: z.string().min(1, "Nama project wajib diisi"),
    location: z.string().min(1, "Lokasi wajib diisi"),
    totalUnits: z.number().int().nonnegative().optional(),
    targetSelesai: z.string().datetime().optional(),
    status: z.string().optional(),
  }),
});

export const updateProjectDto = z.object({
  body: z.object({
    name: z.string().optional(),
    location: z.string().optional(),
    totalUnits: z.number().int().nonnegative().optional(),
    targetSelesai: z.string().datetime().optional(),
    status: z.string().optional(),
  }),
});
