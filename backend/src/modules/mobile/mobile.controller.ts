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
