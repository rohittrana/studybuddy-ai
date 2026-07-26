import Document from "../models/Document.js";
import Quiz from "../models/Quiz.js";
import { generateQuiz } from "../services/quizGenerator.service.js";

// POST /api/quizzes/:documentId/generate
export const createQuiz = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      user: req.user._id,
    });
    if (!document) return res.status(404).json({ message: "Document not found" });

    const numQuestions = req.body.numQuestions || 5;
    const questions = await generateQuiz(document.fullText, numQuestions);

    const quiz = await Quiz.create({
      document: document._id,
      user: req.user._id,
      title: `${document.title} Quiz`,
      questions,
    });

    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};

// GET /api/quizzes/document/:documentId
export const getQuizzesForDocument = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({
      document: req.params.documentId,
      user: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

// GET /api/quizzes/:id
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};
