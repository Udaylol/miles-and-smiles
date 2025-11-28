import express from "express";
import UserController from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { updateUserSchema } from "../validators/userSchema.js";
import { updateCredentialsSchema } from "../validators/credentialsSchema.js";

const router = express.Router();

console.log("updateCredentials =", UserController.updateCredentials);

router.get("/me", auth, UserController.getMe);

router.patch(
  "/me",
  auth,
  validate(updateUserSchema),
  UserController.updateUser
);
router.patch(
  "/me/credentials",
  auth,
  validate(updateCredentialsSchema),
  UserController.updateCredentials
);

export default router;
