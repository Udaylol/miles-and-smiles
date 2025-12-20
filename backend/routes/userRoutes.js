import express from "express";
import UserController from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { updateEmailSchema } from "../validators/emailSchema.js";

const router = express.Router();

router.get("/me", auth, UserController.getMe);

router.get("/:id", auth, UserController.getUserById);

router.patch(
  "/me/email",
  auth,
  validate(updateEmailSchema),
  UserController.updateEmail
);

export default router;
