import { Router } from "express";
import chatController from "../controllers/chat.controller.js";

const router = Router();

// Route to handle chat messages
// POST /api/v1/chat/message
router.route("/message").post(chatController.sendMessage);

export default router;
