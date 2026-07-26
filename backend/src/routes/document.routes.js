import express from "express";
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  summarizeDocument,
} from "../controllers/document.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("pdf"), uploadDocument);
router.get("/", getDocuments);
router.get("/:id", getDocumentById);
router.delete("/:id", deleteDocument);
router.post("/:id/summary", summarizeDocument);

export default router;
