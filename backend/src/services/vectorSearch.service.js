import Chunk from "../models/Chunk.js";
import { generateEmbedding } from "./embedding.service.js";

/**
 * Computes cosine similarity between two equal-length vectors.
 */
const cosineSimilarity = (vecA, vecB) => {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Finds the top-K most relevant chunks for a question within a document.
 * NOTE: this brute-force approach is fine for small/medium docs.
 * For large-scale use, swap in a real vector DB (Pinecone, Chroma, etc).
 * @param {string} documentId
 * @param {string} question
 * @param {number} topK
 */
export const findRelevantChunks = async (documentId, question, topK = 4) => {
  const questionEmbedding = await generateEmbedding(question);
  const chunks = await Chunk.find({ document: documentId });

  const scored = chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(questionEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).map((item) => item.chunk.text);
};
