import { z } from "zod";

export const updateEmailSchema = z.object({
  email: z.email({ message: "Invalid email format" }).trim().toLowerCase(),
});
