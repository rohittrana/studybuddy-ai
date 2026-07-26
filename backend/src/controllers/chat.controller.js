import Document from "../models/Document.js";
import { findRelevantChunks } from "../services/vectorSearch.service.js";
import { answerQuestion } from "../services/summarizer.service.js";

// POST /api/chat/:documentId
export const askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const document = await Document.findOne({
      _id: req.params.documentId,
      user: req.user._id,
    });
    if (!document) return res.status(404).json({ message: "Document not found" });

    if (document.status !== "ready") {
      return res.status(409).json({
        message: "Document is still being processed. Try again in a moment.",
      });
    }

    const relevantChunks = await findRelevantChunks(document._id, question);
    const answer = await answerQuestion(question, relevantChunks);

    res.json({ question, answer });
  } catch (error) {
    next(error);
  }
};
