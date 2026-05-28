import { prisma } from "../../core/config/prisma.js";

export class SitePlansService {
  static async getAllSitePlans(projectId?: string) {
    return await prisma.sitePlan.findMany({
      where: projectId ? { projectId: String(projectId) } : undefined,
    });
  }

  static async createSitePlan(data: any) {
    return await prisma.sitePlan.create({ data });
  }

  static async updateSitePlan(id: string, data: any) {
    return await prisma.sitePlan.update({
      where: { id },
      data,
    });
  }

  static async deleteSitePlan(id: string) {
    return await prisma.sitePlan.delete({
      where: { id },
    });
  }
}
