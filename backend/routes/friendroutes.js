import express from "express";
import { auth } from "../middlewares/auth.js";
import FriendController from "../controllers/friendController.js";

const router = express.Router();

router.get("/", auth, FriendController.getFriends)
router.get("/requests", auth, FriendController.getFriendRequests)

router.post("/request/:userId", auth, FriendController.send)
router.post("/accept/:userId", auth, FriendController.accept)
router.post("/reject/:userId", auth, FriendController.reject)
router.post("/cancel/:userId", auth, FriendController.cancel)

router.delete("/:userId", auth, FriendController.remove)

export default router;
