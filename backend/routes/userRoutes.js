import express from "express";
import UserController from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { updateUserSchema } from "../validation/userSchema.js";

const router = express.Router();

router.get("/me", auth, UserController.getMe);
router.patch("/me", auth, validate(updateUserSchema), UserController.updateUser);

export default router;
