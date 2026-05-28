import { Router } from "express";
import { SitePlansController } from "./site-plans.controller.js";
import { authenticate } from "../../core/middlewares/auth.middleware.js";
import { validate } from "../../core/middlewares/validate.middleware.js";
import { createSitePlanDto, updateSitePlanDto } from "./dto/site-plan.dto.js";

const router = Router();

router.get("/", authenticate, SitePlansController.getAll);
router.post("/", authenticate, validate(createSitePlanDto), SitePlansController.create);
router.put("/:id", authenticate, validate(updateSitePlanDto), SitePlansController.update);
router.delete("/:id", authenticate, SitePlansController.delete);

export default router;
