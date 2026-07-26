import express from "express";
import {
  createFlashcards,
  getFlashcardsForDocument,
  deleteFlashcard,
} from "../controllers/flashcard.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/:documentId/generate", createFlashcards);
router.get("/document/:documentId", getFlashcardsForDocument);
router.delete("/:id", deleteFlashcard);

export default router;
