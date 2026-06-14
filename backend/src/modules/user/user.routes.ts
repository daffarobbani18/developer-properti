import { Router } from "express";
import { UserController } from "./user.controller.js";
import { verifyToken, requireRole } from "../../core/middlewares/auth.middleware.js";

const router = Router();

// Semua rute user management hanya bisa diakses oleh Owner/Superadmin
router.use(verifyToken);
// Di sistem ini kita anggap Owner punya roleName "Owner" atau "Superadmin"
router.use(requireRole(["Owner", "Superadmin"]));

router.get("/", UserController.getAllUsers);
router.post("/", UserController.createUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

router.get("/roles", UserController.getRoles);

export default router;
