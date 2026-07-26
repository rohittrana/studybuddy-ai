import express from "express";
import {
  createQuiz,
  getQuizzesForDocument,
  getQuizById,
} from "../controllers/quiz.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/:documentId/generate", createQuiz);
router.get("/document/:documentId", getQuizzesForDocument);
router.get("/:id", getQuizById);

export default router;
