import express from "express";
import GameController from "../controllers/gameController.js";

const router = express.Router();

router.get("/", GameController.getAllGames);

export default router;
