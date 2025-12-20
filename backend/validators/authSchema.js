import { z } from "zod";

export const signupSchema = z.object({
  email: z.email({ message: "Invalid email address" }).trim().toLowerCase(),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const signinSchema = z.object({
  email: z.email({ message: "Invalid email address" }).trim().toLowerCase(),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});
