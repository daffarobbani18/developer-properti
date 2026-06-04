import { Router } from "express";
import { authenticate } from "../../core/middlewares/auth.middleware.js";
import { getFieldProjects, getProjectOptions, getProjectDetail, getFieldUnits, getUnitMilestones, updateMilestone } from "./mobile.controller.js";

const router = Router();

// Endpoint untuk Field Supervisor
router.get("/field/projects", authenticate, getFieldProjects);
router.get("/field/project-options", authenticate, getProjectOptions);
router.get("/field/projects/:id", authenticate, getProjectDetail);
router.get("/field/units", authenticate, getFieldUnits);
router.get("/field/units/:unitId/milestones", authenticate, getUnitMilestones);
router.patch("/field/milestones/:milestoneId", authenticate, updateMilestone);

export default router;
