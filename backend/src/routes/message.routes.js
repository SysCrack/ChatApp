import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessagesBetweenUsers, getUsersForSidebar, sendMessageToUser } from "../controller/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessagesBetweenUsers);
router.post("/send/:id", protectRoute, sendMessageToUser);


export default router;