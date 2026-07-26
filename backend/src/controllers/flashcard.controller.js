import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import { generateFlashcards } from "../services/flashcardGenerator.service.js";

// POST /api/flashcards/:documentId/generate
export const createFlashcards = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      user: req.user._id,
    });
    if (!document) return res.status(404).json({ message: "Document not found" });

    const numCards = req.body.numCards || 10;
    const cards = await generateFlashcards(document.fullText, numCards);

    const flashcards = await Flashcard.insertMany(
      cards.map((c) => ({
        document: document._id,
        user: req.user._id,
        front: c.front,
        back: c.back,
      }))
    );

    res.status(201).json(flashcards);
  } catch (error) {
    next(error);
  }
};

// GET /api/flashcards/document/:documentId
export const getFlashcardsForDocument = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({
      document: req.params.documentId,
      user: req.user._id,
    }).sort({ createdAt: 1 });
    res.json(flashcards);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/flashcards/:id
export const deleteFlashcard = async (req, res, next) => {
  try {
    const flashcard = await Flashcard.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!flashcard) return res.status(404).json({ message: "Flashcard not found" });
    res.json({ message: "Flashcard deleted" });
  } catch (error) {
    next(error);
  }
};
