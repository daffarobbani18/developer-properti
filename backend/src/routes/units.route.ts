import { Router } from "express";
import { prisma } from "../database/prisma";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// GET all units
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;
    const units = await prisma.unit.findMany({
      where: projectId ? { projectId: String(projectId) } : undefined,
      include: {
        propertyType: true,
      }
    });
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch units" });
  }
});

// POST new unit
router.post("/", authenticate, async (req, res) => {
  try {
    const unit = await prisma.unit.create({
      data: req.body,
    });
    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({ error: "Failed to create unit" });
  }
});

// PUT update unit
router.put("/:id", authenticate, async (req, res) => {
  try {
    const unit = await prisma.unit.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(unit);
  } catch (error) {
    res.status(500).json({ error: "Failed to update unit" });
  }
});

// DELETE unit
router.delete("/:id", authenticate, async (req, res) => {
  try {
    await prisma.unit.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete unit" });
  }
});

export default router;
