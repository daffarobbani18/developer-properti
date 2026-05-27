import { Router } from "express";
import { prisma } from "../database/prisma";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// GET all site plans
router.get("/", authenticate, async (req, res) => {
  try {
    const { projectId } = req.query;
    const sitePlans = await prisma.sitePlan.findMany({
      where: projectId ? { projectId: String(projectId) } : undefined,
    });
    res.json(sitePlans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch site plans" });
  }
});

// POST new site plan
router.post("/", authenticate, async (req, res) => {
  try {
    const sitePlan = await prisma.sitePlan.create({
      data: req.body,
    });
    res.status(201).json(sitePlan);
  } catch (error) {
    res.status(500).json({ error: "Failed to create site plan" });
  }
});

// PUT update site plan
router.put("/:id", authenticate, async (req, res) => {
  try {
    const sitePlan = await prisma.sitePlan.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(sitePlan);
  } catch (error) {
    res.status(500).json({ error: "Failed to update site plan" });
  }
});

// DELETE site plan
router.delete("/:id", authenticate, async (req, res) => {
  try {
    await prisma.sitePlan.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete site plan" });
  }
});

export default router;
