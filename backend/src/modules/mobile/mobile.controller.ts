import { Request, Response } from "express";
import { prisma } from "../../core/config/prisma.js";

export const getFieldProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        units: {
          include: {
            constructionProgresses: {
              orderBy: { recordedAt: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const projectSummaries = projects.map((project) => {
      let totalProgress = 0;
      let unitsWithProgress = 0;

      project.units.forEach((unit) => {
        if (unit.constructionProgresses.length > 0) {
          totalProgress += unit.constructionProgresses[0].percentage;
          unitsWithProgress++;
        }
      });

      const averageProgress =
        project.units.length > 0
          ? Math.round((totalProgress / (project.units.length * 100)) * 100)
          : 0;

      // Alternative calculation: just sum of percentages / number of units
      const simpleAverage =
        project.units.length > 0
          ? Math.round(totalProgress / project.units.length)
          : 0;

      return {
        id: project.id,
        name: project.name,
        totalUnits: project.units.length,
        progress: simpleAverage,
        milestoneDeadlineAlerts: 0, // Placeholder as per plan
      };
    });

    res.json({ data: projectSummaries });
  } catch (error) {
    console.error("Error fetching field projects:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const getProjectOptions = async (req: Request, res: Response): Promise<void> => {
  // Currently identical to getFieldProjects, but can be optimized later
  // to only return id and name if progress isn't needed by the options dropdown.
  await getFieldProjects(req, res);
};

export const getProjectDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        propertyTypes: {
          orderBy: { createdAt: "asc" },
        },
        units: {
          include: {
            propertyType: true,
            constructionProgresses: {
              orderBy: { recordedAt: "desc" },
              take: 1,
            },
            bookings: {
              take: 1,
              orderBy: { createdAt: "desc" },
              include: {
                lead: { select: { name: true } },
              },
            },
          },
          orderBy: [{ blok: "asc" }, { nomorUnit: "asc" }],
        },
        sitePlans: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!project) {
      res.status(404).json({ error: "Proyek tidak ditemukan" });
      return;
    }

    // Calculate overall progress
    let totalProgress = 0;
    project.units.forEach((unit) => {
      if (unit.constructionProgresses.length > 0) {
        totalProgress += unit.constructionProgresses[0].percentage;
      }
    });
    const overallProgress =
      project.units.length > 0
        ? Math.round(totalProgress / project.units.length)
        : 0;

    // Group units by block
    const blockMap = new Map<string, typeof project.units>();
    project.units.forEach((unit) => {
      const block = unit.blok || "Tanpa Blok";
      if (!blockMap.has(block)) {
        blockMap.set(block, []);
      }
      blockMap.get(block)!.push(unit);
    });

    const blocks = Array.from(blockMap.entries()).map(([blockName, blockUnits]) => ({
      name: blockName,
      units: blockUnits.map((unit) => ({
        id: unit.id,
        blok: unit.blok,
        nomorUnit: unit.nomorUnit,
        nomor: unit.nomor,
        kawasan: unit.kawasan,
        typeName: unit.propertyType.name,
        price: unit.totalPrice || unit.price,
        statusPembangunan: unit.statusPembangunan,
        statusPenjualan: unit.statusPenjualan,
        progress: unit.constructionProgresses.length > 0
          ? unit.constructionProgresses[0].percentage
          : 0,
        buyerName: unit.bookings.length > 0 && unit.statusPenjualan !== "Tersedia"
          ? unit.bookings[0].lead.name
          : null,
      })),
    }));

    // Format property types
    const propertyTypes = project.propertyTypes.map((pt) => ({
      id: pt.id,
      name: pt.name,
      luasTanah: pt.luasTanah,
      luasBangunan: pt.luasBangunan,
      kamarTidur: pt.kamarTidur || pt.bedrooms,
      kamarMandi: pt.kamarMandi || pt.bathrooms,
      basePrice: pt.basePrice || pt.price,
      imageUrl: pt.imageUrl,
      facilities: pt.facilities,
    }));

    // Unit status summary
    const statusSummary = {
      tersedia: project.units.filter((u) => u.statusPenjualan === "Tersedia").length,
      booked: project.units.filter((u) => u.statusPenjualan === "Booked").length,
      terjual: project.units.filter((u) => u.statusPenjualan === "Terjual").length,
      total: project.units.length,
    };

    const result = {
      id: project.id,
      name: project.name,
      location: project.location,
      status: project.status,
      totalUnits: project.totalUnits || project.units.length,
      targetSelesai: project.targetSelesai,
      kontraktorName: project.kontraktorName,
      nilaiKontrak: project.nilaiKontrak,
      estimasiAnggaran: project.estimasiAnggaran,
      nomorIzin: project.nomorIzin,
      description: project.description,
      imageUrl: project.imageUrl,
      overallProgress,
      statusSummary,
      propertyTypes,
      blocks,
      sitePlan: project.sitePlans.length > 0
        ? {
            id: project.sitePlans[0].id,
            imageUrl: project.sitePlans[0].imageUrl,
            coordinatesData: project.sitePlans[0].coordinatesData,
          }
        : null,
    };

    res.json({ data: result });
  } catch (error) {
    console.error("Error fetching project detail:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const getFieldUnits = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const search = req.query.search as string | undefined;
    
    const whereClause: any = {};
    if (projectId) {
      whereClause.projectId = projectId;
    }
    
    // Asumsikan pengawas lapangan hanya melihat unit yang sedang/sudah dibangun
    whereClause.statusPenjualan = { not: "Tersedia" }; // Atau bisa disesuaikan dengan rule bisnis
    // Untuk saat ini mari kita ambil semua unit saja
    delete whereClause.statusPenjualan; 

    const units = await prisma.unit.findMany({
      where: whereClause,
      include: {
        project: { select: { name: true } },
        propertyType: { select: { name: true } },
        milestones: { orderBy: { orderNo: 'asc' } }
      },
      orderBy: [{ blok: 'asc' }, { nomorUnit: 'asc' }]
    });
    
    // Jika ada parameter search, filter manual di JS atau tambah kondisi di whereClause. 
    // Di sini cukup sederhana dulu.

    const formattedUnits = units.map(u => {
      const completed = u.milestones.filter(m => m.status === "COMPLETED").length;
      const total = u.milestones.length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        id: u.id,
        projectId: u.projectId,
        code: `${u.blok}-${u.nomor || u.nomorUnit}`,
        typeName: u.propertyType.name,
        status: u.statusPembangunan, // "Pesan Bangun" / "Siap Huni"
        progress: progress,
        // Mock data fallback jika belum ada data asli
        buyerName: "Customer Placeholder", 
        targetDate: new Date().toISOString(),
      };
    });

    res.json({ data: formattedUnits });
  } catch (error) {
    console.error("Error fetching field units:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const getUnitMilestones = async (req: Request, res: Response): Promise<void> => {
  try {
    const unitId = req.params.unitId as string;
    
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { milestones: { orderBy: { orderNo: 'asc' } } }
    });
    
    if (!unit) {
      res.status(404).json({ error: "Unit tidak ditemukan" });
      return;
    }
    
    let milestones = unit.milestones;
    
    // Auto-generate jika belum punya milestone (SOP darurat jika PropertyType belum ada template)
    if (milestones.length === 0) {
      const isReadyStock = unit.statusPembangunan === "Siap Huni";
      const defaultTemplates = ["Pondasi & Sloof", "Struktur & Dinding", "Atap & Plafon", "Finishing", "Serah Terima"];
      
      const newMilestonesData = defaultTemplates.map((name, index) => ({
        unitId: unit.id,
        name: name,
        orderNo: index + 1,
        status: isReadyStock ? "COMPLETED" : "PENDING",
        actualDate: isReadyStock ? new Date() : null,
      }));
      
      await prisma.milestone.createMany({
        data: newMilestonesData
      });
      
      milestones = await prisma.milestone.findMany({
        where: { unitId },
        orderBy: { orderNo: 'asc' }
      });
    }

    const formattedMilestones = milestones.map((m: any) => ({
      id: m.id,
      title: m.name, // Frontend menggunakan "title"
      status: m.status, // "PENDING" | "IN_PROGRESS" | "COMPLETED"
      targetDate: m.targetDate ? m.targetDate.toISOString() : new Date().toISOString(),
      completedDate: m.actualDate ? m.actualDate.toISOString() : undefined,
      notes: m.note || undefined,
      photoUrls: m.photoUrls || [],
      checklistCompleted: m.status === "COMPLETED" ? 1 : 0, // Disederhanakan
      checklistTotal: 1,
    }));

    res.json({ data: formattedMilestones });
  } catch (error) {
    console.error("Error fetching unit milestones:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

export const updateMilestone = async (req: Request, res: Response): Promise<void> => {
  try {
    const milestoneId = req.params.milestoneId as string;
    const { status, note, photoUrl, photoUrls } = req.body;
    
    const milestone = await prisma.milestone.findUnique({ where: { id: milestoneId } });
    if (!milestone) {
      res.status(404).json({ error: "Milestone tidak ditemukan" });
      return;
    }
    
    let updatedPhotoUrls = [...milestone.photoUrls];
    if (photoUrl) updatedPhotoUrls.push(photoUrl);
    if (photoUrls && Array.isArray(photoUrls)) updatedPhotoUrls = [...updatedPhotoUrls, ...photoUrls];
    
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: status || milestone.status,
        note: note !== undefined ? note : milestone.note,
        photoUrls: updatedPhotoUrls,
        actualDate: status === "COMPLETED" && milestone.status !== "COMPLETED" ? new Date() : milestone.actualDate
      }
    });
    
    // Update persentase unit jika perlu (opsional: bisa diambil on the fly saja di controller lain)
    
    const formatted = {
      id: updatedMilestone.id,
      title: updatedMilestone.name,
      status: updatedMilestone.status,
      targetDate: updatedMilestone.targetDate ? updatedMilestone.targetDate.toISOString() : new Date().toISOString(),
      completedDate: updatedMilestone.actualDate ? updatedMilestone.actualDate.toISOString() : undefined,
      notes: updatedMilestone.note || undefined,
      photoUrls: updatedMilestone.photoUrls || [],
      checklistCompleted: updatedMilestone.status === "COMPLETED" ? 1 : 0,
      checklistTotal: 1,
    };
    
    res.json({ data: formatted });
  } catch (error) {
    console.error("Error updating milestone:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
