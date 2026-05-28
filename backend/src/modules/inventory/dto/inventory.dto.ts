import { z } from "zod";

export const createPropertyTypeDto = z.object({
  body: z.object({
    projectId: z.string().uuid("projectId harus berupa UUID"),
    name: z.string().min(1, "Nama tipe properti wajib diisi"),
    luasTanah: z.number().nonnegative().optional(),
    luasBangunan: z.number().nonnegative().optional(),
    kamarTidur: z.number().nonnegative().optional(),
    kamarMandi: z.number().nonnegative().optional(),
    basePrice: z.number().positive("Harga dasar harus lebih dari 0"),
  }),
});

export const createUnitDto = z.object({
  body: z.object({
    projectId: z.string().uuid("projectId harus berupa UUID"),
    propertyTypeId: z.string().uuid("propertyTypeId harus berupa UUID"),
    kawasan: z.string().min(1, "Kawasan wajib diisi"),
    blok: z.string().min(1, "Blok wajib diisi"),
    nomor: z.string().min(1, "Nomor wajib diisi"),
    statusPembangunan: z.string().optional(),
    statusPenjualan: z.string().optional(),
    priceMarkup: z.number().nonnegative().optional(),
    luasTanahAktual: z.number().nonnegative().optional(),
  }),
});
