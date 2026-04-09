import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/errors";

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  const message = error instanceof Error ? error.message : "Internal server error";
  res.status(500).json({ message });
};
