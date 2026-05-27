import { Router } from "express";
import { prisma } from "../database/prisma";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// GET all projects
router.get("/", authenticate, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: { propertyTypes: true, units: true, sitePlans: true },
        },
      },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// GET one project
router.get("/:id", authenticate, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        propertyTypes: true,
        units: true,
        sitePlans: true,
      },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// POST new project
router.post("/", authenticate, async (req, res) => {
  try {
    const project = await prisma.project.create({
      data: req.body,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT update project
router.put("/:id", authenticate, async (req, res) => {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

export default router;
