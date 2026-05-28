import { prisma } from "../../core/config/prisma.js";

export class ProjectsService {
  static async getAllProjects() {
    return await prisma.project.findMany({
      include: {
        _count: {
          select: { propertyTypes: true, units: true, sitePlans: true },
        },
      },
    });
  }

  static async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        propertyTypes: true,
        units: true,
        sitePlans: true,
      },
    });
    if (!project) throw new Error("Project not found");
    return project;
  }

  static async createProject(data: any) {
    return await prisma.project.create({ data });
  }

  static async updateProject(id: string, data: any) {
    return await prisma.project.update({
      where: { id },
      data,
    });
  }
}
