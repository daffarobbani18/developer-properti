import { Router } from "express";
import { prisma } from "../database/prisma";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// GET all property types (can filter by projectId)
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;
    const propertyTypes = await prisma.propertyType.findMany({
      where: projectId ? { projectId: String(projectId) } : undefined,
    });
    res.json(propertyTypes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch property types" });
  }
});
// GET single property type by id
router.get("/:id", async (req, res) => {
  try {
    const propertyType = await prisma.propertyType.findUnique({
      where: { id: req.params.id },
      include: { Unit: true }
    });
    if (!propertyType) {
      return res.status(404).json({ error: "Property type not found" });
    }
    res.json(propertyType);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch property type" });
  }
});

// POST new property type
router.post("/", authenticate, async (req, res) => {
  try {
    const propertyType = await prisma.propertyType.create({
      data: req.body,
    });
    res.status(201).json(propertyType);
  } catch (error) {
    res.status(500).json({ error: "Failed to create property type" });
  }
});

// PUT update property type
router.put("/:id", authenticate, async (req, res) => {
  try {
    const propertyType = await prisma.propertyType.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(propertyType);
  } catch (error) {
    res.status(500).json({ error: "Failed to update property type" });
  }
});

// DELETE property type
router.delete("/:id", authenticate, async (req, res) => {
  try {
    await prisma.propertyType.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete property type" });
  }
});

export default router;
