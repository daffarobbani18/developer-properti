import { Request, Response } from "express";
import { SitePlansService } from "./site-plans.service.js";

export class SitePlansController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const sitePlans = await SitePlansService.getAllSitePlans(req.query.projectId as string);
      res.json(sitePlans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site plans" });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const sitePlan = await SitePlansService.createSitePlan(req.body);
      res.status(201).json(sitePlan);
    } catch (error) {
      res.status(500).json({ error: "Failed to create site plan" });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const sitePlan = await SitePlansService.updateSitePlan(String(req.params.id), req.body);
      res.json(sitePlan);
    } catch (error) {
      res.status(500).json({ error: "Failed to update site plan" });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      await SitePlansService.deleteSitePlan(String(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete site plan" });
    }
  }
}
