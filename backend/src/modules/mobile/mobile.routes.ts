import { Router } from "express";
import { authenticate } from "../../core/middlewares/auth.middleware.js";
import { getFieldProjects, getProjectOptions } from "./mobile.controller.js";

const router = Router();

// Endpoint untuk Field Supervisor
router.get("/field/projects", authenticate, getFieldProjects);
router.get("/field/project-options", authenticate, getProjectOptions);

export default router;
