import { Request, Response } from "express";
import { prisma } from "../../core/config/prisma.js";

export class PublicController {
  static async getProjects(req: Request, res: Response) {
    try {
      const projects = await prisma.project.findMany({
        select: {
          id: true,
          name: true,
          location: true,
          imageUrl: true,
          description: true,
          status: true,
        },
      });
      res.json({ success: true, data: projects });
    } catch (error) {
      console.error("Public getProjects Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async getProjectDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const projectId: string = Array.isArray(id) ? id[0] : id;
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          propertyTypes: true,
          sitePlans: true,
          units: {
            select: {
              id: true,
              kawasan: true,
              blok: true,
              nomor: true,
              statusPenjualan: true,
              svgPathId: true,
              propertyTypeId: true,
              priceMarkup: true,
              luasTanahAktual: true,
            },
          },
        },
      });

      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }

      res.json({ success: true, data: project });
    } catch (error) {
      console.error("Public getProjectDetails Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async submitLead(req: Request, res: Response) {
    try {
      const { name, phone, email, source, notes } = req.body;

      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          message: "Nama dan Nomor Telepon wajib diisi",
        });
      }

      const lead = await prisma.lead.create({
        data: {
          name,
          phone,
          email: email || null,
          source: source || "Website Public",
          notes: notes || null,
        },
      });

      res.status(201).json({
        success: true,
        data: lead,
        message: "Berhasil mengirim data prospek",
      });
    } catch (error) {
      console.error("Error submitting lead:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan internal server",
      });
    }
  }
}
