import express from "express";
import { askQuestion } from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/:documentId", askQuestion);

export default router;
