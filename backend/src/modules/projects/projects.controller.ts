import { Request, Response } from "express";
import { ProjectsService } from "./projects.service.js";

export class ProjectsController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = await ProjectsService.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const project = await ProjectsService.getProjectById(String(req.params.id));
      res.json(project);
    } catch (error: any) {
      if (error.message === "Project not found") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to fetch project" });
      }
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const project = await ProjectsService.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const project = await ProjectsService.updateProject(String(req.params.id), req.body);
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  }
}
