import express from "express";
import { handleChatMessage } from "../controllers/chatbotController.js";
import { checkAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/chatbot — requires authentication
router.post("/", checkAuth, handleChatMessage);

export default router;
