import { z } from "zod";

export const loginDto = z.object({
  body: z.object({
    email: z.string({ error: "Email wajib diisi" }).email("Format email tidak valid"),
    password: z.string({ error: "Password wajib diisi" }).min(1, "Password wajib diisi"),
  }),
});
