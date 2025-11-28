import { z } from "zod";

export const updateUserSchema = z
  .object({
    username: z.string().min(3).max(20).optional(),
    birthday: z.coerce.date().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
  })
  .partial()
  .optional();
