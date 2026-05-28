import { Router } from "express";
import { ProjectsController } from "./projects.controller.js";
import { authenticate } from "../../core/middlewares/auth.middleware.js";
import { validate } from "../../core/middlewares/validate.middleware.js";
import { createProjectDto, updateProjectDto } from "./dto/project.dto.js";

const router = Router();

// Endpoint definitions...
router.get("/", authenticate, ProjectsController.getAll);
router.get("/:id", authenticate, ProjectsController.getById);
router.post("/", authenticate, validate(createProjectDto), ProjectsController.create);
router.put("/:id", authenticate, validate(updateProjectDto), ProjectsController.update);
router.delete("/:id", authenticate, ProjectsController.delete);

export default router;
