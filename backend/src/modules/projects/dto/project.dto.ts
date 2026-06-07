import { z } from "zod";

export const createProjectDto = z.object({
  body: z.object({
    name: z.string().min(1, "Nama project wajib diisi"),
    location: z.string().min(1, "Lokasi wajib diisi"),
    totalUnits: z.number().int().nonnegative().optional(),
    targetSelesai: z.string().datetime().optional(),
    status: z.string().optional(),
    jumlahKontraktor: z.number().int().nonnegative().optional(),
    nilaiKontrak: z.number().nonnegative().optional(),
    kontraktorName: z.string().optional().nullable(),
    nomorIzin: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
  })
});

export const updateProjectDto = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    location: z.string().min(5).optional(),
    totalUnits: z.number().int().nonnegative().optional(),
    targetSelesai: z.string().optional().nullable(),
    status: z.enum(["perencanaan", "konstruksi", "finishing", "selesai"]).optional(),
    kontraktorName: z.string().optional().nullable(),
    nomorIzin: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    imageUrl: z.string().nullable().optional(),
  }),
});
