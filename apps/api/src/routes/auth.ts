import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "../db";
import { authenticate } from "../middleware/auth";
import { isRole } from "../types/auth";
import { asyncHandler } from "../utils/async-handler";
import { signToken } from "../utils/auth";
import { HttpError } from "../utils/errors";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const authRouter = Router();

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpError(401, "Email atau password tidak valid");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new HttpError(401, "Email atau password tidak valid");
    }

    if (!isRole(user.role)) {
      throw new HttpError(500, "Role user tidak valid");
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      }
    });
  })
);

authRouter.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true
      }
    });

    if (!user) {
      throw new HttpError(404, "User tidak ditemukan");
    }

    res.json({ data: user });
  })
);
