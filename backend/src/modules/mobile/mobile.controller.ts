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
