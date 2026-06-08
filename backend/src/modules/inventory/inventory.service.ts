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
    estimasiRab: number;
    bedrooms?: number; // legacy fallback
    bathrooms?: number; // legacy fallback
    price?: number; // legacy fallback
    imageUrl?: string;
    facilities?: string | null;
    milestoneTemplates: { name: string; bobotPersentase: number }[];
  }) {
    if (!data.milestoneTemplates || data.milestoneTemplates.length === 0) {
      throw new Error("Milestone template wajib diisi minimal 1 tahapan.");
    }
    const totalPersentase = data.milestoneTemplates.reduce((sum, t) => sum + (Number(t.bobotPersentase) || 0), 0);
    if (totalPersentase !== 100) {
      throw new Error("Total bobot persentase milestone harus tepat 100.");
    }
    return await prisma.propertyType.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        luasTanah: data.luasTanah,
        luasBangunan: data.luasBangunan,
        kamarTidur: data.kamarTidur,
        kamarMandi: data.kamarMandi,
        basePrice: data.basePrice,
        estimasiRab: data.estimasiRab,
        // Isi field lama dengan nilai yang sama agar tidak error pada aplikasi lama
        bedrooms: data.kamarTidur,
        bathrooms: data.kamarMandi,
        price: data.basePrice,
        imageUrl: data.imageUrl,
        facilities: data.facilities,
        milestoneTemplates: {
          create: data.milestoneTemplates.map((template, index) => ({
            name: template.name,
            bobotPersentase: Number(template.bobotPersentase) || 0,
            orderNo: index + 1,
          })),
        },
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
        milestoneTemplates: {
          orderBy: { orderNo: 'asc' }
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
    estimasiRab?: number;
    imageUrl?: string;
    facilities?: string | null;
    milestoneTemplates: { name: string; bobotPersentase: number }[];
  }) {
    if (!data.milestoneTemplates || data.milestoneTemplates.length === 0) {
      throw new Error("Milestone template wajib diisi minimal 1 tahapan.");
    }
    const totalPersentase = data.milestoneTemplates.reduce((sum, t) => sum + (Number(t.bobotPersentase) || 0), 0);
    if (totalPersentase !== 100) {
      throw new Error("Total bobot persentase milestone harus tepat 100.");
    }
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
        ...(data.estimasiRab !== undefined && { estimasiRab: data.estimasiRab }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.facilities !== undefined && { facilities: data.facilities }),
        ...(data.milestoneTemplates !== undefined && {
          milestoneTemplates: {
            deleteMany: {},
            create: data.milestoneTemplates.map((template, index) => ({
              name: template.name,
              bobotPersentase: Number(template.bobotPersentase) || 0,
              orderNo: index + 1,
            })),
          },
        }),
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
    // Validasi duplikasi blok & nomor di kawasan yang sama dalam 1 proyek
    const existingUnit = await prisma.unit.findFirst({
      where: {
        projectId: data.projectId,
        kawasan: data.kawasan,
        blok: data.blok,
        nomor: data.nomor,
      },
    });

    if (existingUnit) {
      throw new Error(`Unit dengan Blok ${data.blok} dan Nomor ${data.nomor} sudah ada di Kawasan ${data.kawasan} pada proyek ini`);
    }

    // Dapatkan data PropertyType untuk mengambil basePrice & milestone templates
    const propertyType = await prisma.propertyType.findUnique({
      where: { id: data.propertyTypeId },
      include: { milestoneTemplates: { orderBy: { orderNo: 'asc' } } }
    });

    if (!propertyType) {
      throw new Error("Property Type tidak ditemukan");
    }

    // Kalkulasi total_price = basePrice + priceMarkup
    const totalPrice = propertyType.basePrice + data.priceMarkup;
    
    // Status awal milestone
    const isReadyStock = data.statusPembangunan === "Siap Huni";

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
        ...(isReadyStock && propertyType.milestoneTemplates && {
          milestones: {
            create: propertyType.milestoneTemplates.map((template) => ({
              name: template.name,
              orderNo: template.orderNo,
              status: "COMPLETED",
              actualDate: new Date(),
            })),
          },
        }),
      },
    });
  }

  /**
   * Bulk Create Unit Kavling
   */
  static async createBulkKavlingUnits(data: {
    projectId: string;
    propertyTypeId: string;
    kawasan: string;
    blok: string;
    startNumber: number;
    endNumber: number;
    skipNumbers?: string | null;
    statusPembangunan: string;
    statusPenjualan: string;
    priceMarkup: number;
  }) {
    const propertyType = await prisma.propertyType.findUnique({
      where: { id: data.propertyTypeId },
      include: { milestoneTemplates: { orderBy: { orderNo: 'asc' } } }
    });

    if (!propertyType) {
      throw new Error("Property Type tidak ditemukan");
    }

    const totalPrice = propertyType.basePrice + data.priceMarkup;
    const isReadyStock = data.statusPembangunan === "Siap Huni";

    const skips = data.skipNumbers
      ? data.skipNumbers.split(",").map(s => s.trim())
      : [];

    const createPromises: any[] = [];
    let count = 0;

    for (let i = data.startNumber; i <= data.endNumber; i++) {
      const nomorString = i < 10 ? `0${i}` : `${i}`;
      if (skips.includes(nomorString) || skips.includes(String(i))) {
        continue;
      }

      const exists = await prisma.unit.findFirst({
        where: { projectId: data.projectId, blok: data.blok, nomor: nomorString }
      });
      
      if (exists) {
        throw new Error(`Unit Blok ${data.blok} Nomor ${nomorString} sudah ada. Batalkan bulk proses.`);
      }

      const unitCreate = prisma.unit.create({
        data: {
          projectId: data.projectId,
          propertyTypeId: data.propertyTypeId,
          kawasan: data.kawasan,
          blok: data.blok,
          nomor: nomorString,
          statusPembangunan: data.statusPembangunan || "Pesan Bangun",
          statusPenjualan: data.statusPenjualan || "Tersedia",
          priceMarkup: data.priceMarkup,
          totalPrice: totalPrice,
          nomorUnit: `${data.blok}-${nomorString}`,
          price: totalPrice,
          ...(isReadyStock && propertyType.milestoneTemplates && {
            milestones: {
              create: propertyType.milestoneTemplates.map((template) => ({
                name: template.name,
                orderNo: template.orderNo,
                status: "COMPLETED",
                actualDate: new Date(),
              })),
            },
          }),
        }
      });
      createPromises.push(unitCreate);
      count++;
    }

    await prisma.$transaction(createPromises);
    return count;
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
          select: { name: true, basePrice: true, estimasiRab: true },
        },
        project: {
          select: { name: true },
        },
      },
    });
  }

  static async updateKavlingUnit(id: string, data: any) {
    const propertyType = await prisma.propertyType.findUnique({
      where: { id: data.propertyTypeId },
    });

    if (!propertyType) {
      throw new Error("Property Type tidak ditemukan");
    }

    const totalPrice = propertyType.basePrice + (data.priceMarkup || 0);

    return await prisma.unit.update({
      where: { id },
      data: {
        propertyTypeId: data.propertyTypeId,
        kawasan: data.kawasan,
        blok: data.blok,
        nomor: data.nomor,
        statusPembangunan: data.statusPembangunan,
        statusPenjualan: data.statusPenjualan,
        priceMarkup: data.priceMarkup,
        totalPrice: totalPrice,
        nomorUnit: data.nomor,
        price: totalPrice,
        status: data.statusPenjualan,
        luasTanahAktual: data.luasTanahAktual,
      },
    });
  }

  static async deleteKavlingUnit(id: string) {
    return await prisma.unit.delete({
      where: { id },
    });
  }
}
