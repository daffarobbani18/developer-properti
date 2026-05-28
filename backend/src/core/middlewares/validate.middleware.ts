import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Generic middleware untuk memvalidasi request (body, query, params) menggunakan Zod Schema.
 * Membantu memisahkan logika validasi dari Controller.
 */
export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format pesan error Zod menjadi lebih rapi
        const zodErrors = error.errors || error.issues || [];
        const errorMessages = zodErrors.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        res.status(400).json({
          error: "Validasi Gagal",
          details: errorMessages,
        });
      } else {
        res.status(500).json({ error: "Terjadi kesalahan internal server" });
      }
    }
  };
