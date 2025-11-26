import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();
router.get("/me", UserController.getMe);
router.patch("/me", UserController.updateUser);

export default router;
