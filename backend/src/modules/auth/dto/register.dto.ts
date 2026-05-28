import { z } from "zod";

export const registerDto = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    roleId: z.string().uuid("ID Role harus berupa UUID"),
  }),
});
