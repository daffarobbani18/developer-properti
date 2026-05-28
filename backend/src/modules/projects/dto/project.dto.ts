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
    kontraktorName: z.string().optional(),
    estimasiAnggaran: z.number().nonnegative().optional(),
    nomorIzin: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().nullable().optional(),
  }),
});

export const updateProjectDto = z.object({
  body: z.object({
    name: z.string().optional(),
    location: z.string().optional(),
    totalUnits: z.number().int().nonnegative().optional(),
    targetSelesai: z.string().datetime().optional(),
    status: z.string().optional(),
    kontraktorName: z.string().optional(),
    estimasiAnggaran: z.number().nonnegative().optional(),
    nomorIzin: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().nullable().optional(),
  }),
});
