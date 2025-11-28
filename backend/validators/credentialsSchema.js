import { z } from "zod";

export const updateCredentialsSchema = z
  .object({
    email: z.email().optional(),
    username: z.string().min(3).max(20).optional(),
  })
  .optional();
