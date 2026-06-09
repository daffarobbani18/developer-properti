import { Request, Response } from "express";
import { prisma } from "../../core/config/prisma.js";

export const getFieldProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        units: {
          where: { spkId: { not: null } },
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
          where: { spkId: { not: null } },
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
      estimasiAnggaran: null,
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
    
    // Pengawas lapangan hanya melihat unit yang sudah terbit SPK nya
    whereClause.spkId = { not: null };

    const units = await prisma.unit.findMany({
      where: whereClause,
      include: {
        project: { select: { name: true } },
        propertyType: { select: { name: true } },
        milestones: { orderBy: { orderNo: 'asc' } },
        bookings: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { lead: { select: { name: true } } }
        }
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
        buyerName: u.bookings.length > 0 ? u.bookings[0].lead.name : null, 
        targetDate: u.milestones.length > 0 && u.milestones[u.milestones.length - 1].targetDate 
          ? u.milestones[u.milestones.length - 1].targetDate!.toISOString() 
          : new Date().toISOString(),
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
      include: { 
        milestones: { 
          orderBy: { orderNo: 'asc' },
          include: { logs: { orderBy: { createdAt: 'desc' } } }
        } 
      }
    });
    
    if (!unit) {
      res.status(404).json({ error: "Unit tidak ditemukan" });
      return;
    }
    
    const milestones = unit.milestones;

    const formattedMilestones = milestones.map((m: any) => ({
      id: m.id,
      name: m.name,
      category: m.category,
      bobotPersentase: m.bobotPersentase,
      orderNo: m.orderNo,
      status: m.status, // "PENDING" | "IN_PROGRESS" | "COMPLETED"
      targetDate: m.targetDate ? m.targetDate.toISOString() : new Date().toISOString(),
      actualDate: m.actualDate ? m.actualDate.toISOString() : undefined,
      note: m.note || undefined,
      photos: (m.photoUrls || []).map((url: string, idx: number) => ({
        id: `photo-${m.id}-${idx}`,
        url,
        caption: `Foto progres`,
        createdAt: m.actualDate ? m.actualDate.toISOString() : new Date().toISOString()
      })),
      logs: (m.logs || []).map((log: any) => ({
        id: log.id,
        status: log.status,
        note: log.note,
        photoUrls: log.photoUrls,
        createdAt: log.createdAt.toISOString()
      })),
      checklist: [], // Disederhanakan
      checklistCompleted: m.status === "COMPLETED" ? 1 : 0, 
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
    
    const isTransitioningToCompleted = status === "COMPLETED" && milestone.status !== "COMPLETED";

    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: status || milestone.status,
        note: note !== undefined ? note : milestone.note,
        photoUrls: updatedPhotoUrls,
        actualDate: isTransitioningToCompleted ? new Date() : milestone.actualDate
      }
    });

    let incomingPhotos: string[] = [];
    if (photoUrl) incomingPhotos.push(photoUrl);
    if (photoUrls && Array.isArray(photoUrls)) incomingPhotos = [...incomingPhotos, ...photoUrls];

    const log = await prisma.milestoneLog.create({
      data: {
        milestoneId,
        status: status || milestone.status,
        note: note || null,
        photoUrls: incomingPhotos,
      }
    });
    
    // Update persentase unit otomatis
    if (isTransitioningToCompleted) {
      const allUnitMilestones = await prisma.milestone.findMany({
        where: { unitId: milestone.unitId }
      });
      const completedMilestones = allUnitMilestones.filter(m => m.status === "COMPLETED");
      const totalProgress = completedMilestones.reduce((acc, m) => acc + (m.bobotPersentase || 0), 0);
      
      await prisma.unit.update({
        where: { id: milestone.unitId },
        data: { progress: Math.min(totalProgress, 100) }
      });
    }
    
    const formatted = {
      id: updatedMilestone.id,
      name: updatedMilestone.name,
      category: updatedMilestone.category,
      bobotPersentase: updatedMilestone.bobotPersentase,
      orderNo: updatedMilestone.orderNo,
      status: updatedMilestone.status,
      targetDate: updatedMilestone.targetDate ? updatedMilestone.targetDate.toISOString() : new Date().toISOString(),
      actualDate: updatedMilestone.actualDate ? updatedMilestone.actualDate.toISOString() : undefined,
      note: updatedMilestone.note || undefined,
      photos: (updatedMilestone.photoUrls || []).map((url: string, idx: number) => ({
        id: `photo-${updatedMilestone.id}-${idx}`,
        url,
        caption: `Foto progres`,
        createdAt: updatedMilestone.actualDate ? updatedMilestone.actualDate.toISOString() : new Date().toISOString()
      })),
      logs: [{
        id: log.id,
        status: log.status,
        note: log.note,
        photoUrls: log.photoUrls,
        createdAt: log.createdAt.toISOString()
      }],
      checklist: [],
      checklistCompleted: updatedMilestone.status === "COMPLETED" ? 1 : 0,
      checklistTotal: 1,
    };
    
    res.json({ data: formatted });
  } catch (error) {
    console.error("Error updating milestone:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
