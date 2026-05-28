import { prisma } from "../../core/config/prisma.js";

export class InventoryService {
  /**
   * Menambahkan tipe properti / tipe rumah baru
   */
  static async createPropertyType(data: {
    projectId: string;
    name: string;
    luasTanah: number;
    luasBangunan: number;
    kamarTidur: number;
    kamarMandi: number;
    basePrice: number;
    bedrooms?: number; // legacy fallback
    bathrooms?: number; // legacy fallback
    price?: number; // legacy fallback
    imageUrl?: string;
  }) {
    return await prisma.propertyType.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        luasTanah: data.luasTanah,
        luasBangunan: data.luasBangunan,
        kamarTidur: data.kamarTidur,
        kamarMandi: data.kamarMandi,
        basePrice: data.basePrice,
        // Isi field lama dengan nilai yang sama agar tidak error pada aplikasi lama
        bedrooms: data.kamarTidur,
        bathrooms: data.kamarMandi,
        price: data.basePrice,
        imageUrl: data.imageUrl,
      },
    });
  }

  /**
   * Mengambil semua tipe properti
   */
  static async getAllPropertyTypes() {
    return await prisma.propertyType.findMany({
      include: {
        project: {
          select: { name: true },
        },
      },
    });
  }

  /**
   * Memperbarui tipe properti
   */
  static async updatePropertyType(id: string, data: {
    projectId?: string;
    name?: string;
    luasTanah?: number;
    luasBangunan?: number;
    kamarTidur?: number;
    kamarMandi?: number;
    basePrice?: number;
    imageUrl?: string;
  }) {
    return await prisma.propertyType.update({
      where: { id },
      data: {
        ...(data.projectId && { projectId: data.projectId }),
        ...(data.name && { name: data.name }),
        ...(data.luasTanah !== undefined && { luasTanah: data.luasTanah }),
        ...(data.luasBangunan !== undefined && { luasBangunan: data.luasBangunan }),
        ...(data.kamarTidur !== undefined && { kamarTidur: data.kamarTidur, bedrooms: data.kamarTidur }),
        ...(data.kamarMandi !== undefined && { kamarMandi: data.kamarMandi, bathrooms: data.kamarMandi }),
        ...(data.basePrice !== undefined && { basePrice: data.basePrice, price: data.basePrice }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      },
    });
  }

  /**
   * Menghapus tipe properti
   */
  static async deletePropertyType(id: string) {
    return await prisma.propertyType.delete({
      where: { id },
    });
  }

  /**
   * Menambahkan unit kavling baru dengan validasi unik per blok & nomor di kawasan yang sama
   */
  static async createKavlingUnit(data: {
    projectId: string;
    propertyTypeId: string;
    kawasan: string;
    blok: string;
    nomor: string;
    statusPembangunan: string;
    statusPenjualan: string;
    priceMarkup: number;
    nomorUnit?: string; // legacy fallback
    luasTanahAktual?: number;
  }) {
    // Validasi duplikasi blok & nomor di kawasan yang sama
    const existingUnit = await prisma.unit.findFirst({
      where: {
        kawasan: data.kawasan,
        blok: data.blok,
        nomor: data.nomor,
      },
    });

    if (existingUnit) {
      throw new Error(`Unit dengan Blok ${data.blok} dan Nomor ${data.nomor} sudah ada di Kawasan ${data.kawasan}`);
    }

    // Dapatkan data PropertyType untuk mengambil basePrice
    const propertyType = await prisma.propertyType.findUnique({
      where: { id: data.propertyTypeId },
    });

    if (!propertyType) {
      throw new Error("Property Type tidak ditemukan");
    }

    // Kalkulasi total_price = basePrice + priceMarkup
    const totalPrice = propertyType.basePrice + data.priceMarkup;

    // Buat data
    return await prisma.unit.create({
      data: {
        projectId: data.projectId,
        propertyTypeId: data.propertyTypeId,
        kawasan: data.kawasan,
        blok: data.blok,
        nomor: data.nomor,
        statusPembangunan: data.statusPembangunan,
        statusPenjualan: data.statusPenjualan || "Tersedia",
        priceMarkup: data.priceMarkup,
        totalPrice: totalPrice,
        // Isi field lama dengan nilai terkait
        nomorUnit: data.nomor,
        price: totalPrice,
        status: data.statusPenjualan || "Tersedia",
        luasTanahAktual: data.luasTanahAktual,
      },
    });
  }

  /**
   * Mengambil semua unit kavling dengan dukungan filter
   */
  static async getAllKavlingUnits(filters?: { statusPenjualan?: string; kawasan?: string }) {
    const whereClause: any = {};
    if (filters?.statusPenjualan) {
      whereClause.statusPenjualan = filters.statusPenjualan;
    }
    if (filters?.kawasan) {
      whereClause.kawasan = { contains: filters.kawasan, mode: "insensitive" };
    }

    return await prisma.unit.findMany({
      where: whereClause,
      include: {
        propertyType: {
          select: { name: true, basePrice: true },
        },
        project: {
          select: { name: true },
        },
      },
    });
  }
}
