import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();

router.post("/signin", AuthController.signin);
router.post("/signup", AuthController.signup);
router.post("/signout", AuthController.signout);

export default router;
