import { Router } from "express";
import { PublicController } from "./public.controller.js";

const router = Router();

router.get("/projects", PublicController.getProjects);
router.get("/projects/:id", PublicController.getProjectDetails);
router.post("/leads", PublicController.submitLead);

export default router;

