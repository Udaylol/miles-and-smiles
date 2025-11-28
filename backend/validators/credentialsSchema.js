import { z } from "zod";

export const updateCredentialsSchema = z
  .object({
    email: z.string().email().optional(),
    username: z.string().min(3).max(20).optional(),
  })
  .partial()
  .refine((data) => data.email || data.username, {
    message: "Provide either email or username",
  })
  .optional();
