import fs from "fs";
import Document from "../models/Document.js";
import Chunk from "../models/Chunk.js";
import { extractTextFromPDF } from "../services/pdfParser.service.js";
import { splitTextIntoChunks } from "../services/chunker.service.js";
import { generateEmbeddingsBatch } from "../services/embedding.service.js";
import { generateSummary } from "../services/summarizer.service.js";

// POST /api/documents/upload
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    const { text, pageCount } = await extractTextFromPDF(req.file.path);

    const document = await Document.create({
      user: req.user._id,
      title: req.body.title || req.file.originalname.replace(/\.pdf$/i, ""),
      originalFileName: req.file.originalname,
      fullText: text,
      pageCount,
      status: "processing",
    });

    // Clean up the temp file now that text is extracted and saved in DB
    fs.unlink(req.file.path, () => {});

    // Chunk + embed asynchronously so the upload response returns fast
    processDocumentEmbeddings(document._id, text).catch((err) =>
      console.error(`Embedding pipeline failed for doc ${document._id}:`, err.message)
    );

    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
};

// Background job: split text into chunks, embed them, save, mark ready
const processDocumentEmbeddings = async (documentId, text) => {
  const chunks = splitTextIntoChunks(text);
  const embeddings = await generateEmbeddingsBatch(chunks);

  const chunkDocs = chunks.map((chunkText, i) => ({
    document: documentId,
    text: chunkText,
    chunkIndex: i,
    embedding: embeddings[i],
  }));

  await Chunk.insertMany(chunkDocs);
  await Document.findByIdAndUpdate(documentId, { status: "ready" });
};

// GET /api/documents
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ user: req.user._id })
      .select("-fullText")
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    next(error);
  }
};

// GET /api/documents/:id
export const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!document) return res.status(404).json({ message: "Document not found" });
    res.json(document);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/documents/:id
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!document) return res.status(404).json({ message: "Document not found" });
    await Chunk.deleteMany({ document: document._id });
    res.json({ message: "Document deleted" });
  } catch (error) {
    next(error);
  }
};

// POST /api/documents/:id/summary
export const summarizeDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!document) return res.status(404).json({ message: "Document not found" });

    if (document.summary) {
      return res.json({ summary: document.summary });
    }

    const summary = await generateSummary(document.fullText);
    document.summary = summary;
    await document.save();

    res.json({ summary });
  } catch (error) {
    next(error);
  }
};
