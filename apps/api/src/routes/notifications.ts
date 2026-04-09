import { Router } from "express";

import { prisma } from "../db";
import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";
import { readRouteParam } from "../utils/request";

export const notificationRouter = Router();

notificationRouter.use(authenticate);

notificationRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: notifications });
  })
);

notificationRouter.patch(
  "/:id/read",
  asyncHandler(async (req, res) => {
    const notificationId = readRouteParam(req.params.id, "id");

    const updated = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: req.user!.id
      },
      data: {
        isRead: true
      }
    });

    res.json({ data: updated });
  })
);

notificationRouter.patch(
  "/read-all",
  asyncHandler(async (req, res) => {
    const updated = await prisma.notification.updateMany({
      where: {
        userId: req.user!.id,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    res.json({ data: updated });
  })
);
