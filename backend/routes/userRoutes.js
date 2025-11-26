import express from "express";
import UserController from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();
router.get("/me", auth, UserController.getMe);
router.patch("/me", auth, UserController.updateUser);

export default router;