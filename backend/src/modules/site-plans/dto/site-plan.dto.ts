import { z } from "zod";

export const createSitePlanDto = z.object({
  body: z.object({
    projectId: z.string().uuid("projectId harus berupa UUID"),
    imageUrl: z.string().min(1, "imageUrl wajib diisi"),
  }),
});

export const updateSitePlanDto = z.object({
  body: z.object({
    projectId: z.string().uuid("projectId harus berupa UUID").optional(),
    imageUrl: z.string().optional(),
  }),
});
