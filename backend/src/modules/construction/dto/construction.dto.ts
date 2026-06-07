import { z } from "zod";

export const recordProgressDto = z.object({
  body: z.object({
    percentage: z.coerce.number().int().min(0).max(100, "Persentase harus antara 0-100"),
    description: z.string().min(1, "Keterangan wajib diisi"),
  }),
});

export const createSpkDto = z.object({
  body: z.object({
    spkNo: z.string().min(1, "No SPK wajib diisi"),
    date: z.string().min(1, "Tanggal wajib diisi"),
    contractorName: z.string().min(1, "Nama Kontraktor wajib diisi"),
    totalPrice: z.number().min(0, "Total Harga tidak boleh negatif"),
    unitIds: z.array(z.string()).min(1, "Pilih minimal 1 unit"),
  }),
});
