import { pipeline } from "@xenova/transformers";

// Loaded once and reused across calls (model downloads to disk on first run, ~90MB).
let embedderPromise = null;

const getEmbedder = () => {
  if (!embedderPromise) {
    embedderPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedderPromise;
};

/**
 * Generates an embedding vector for a single piece of text.
 * Runs locally via transformers.js — completely free, no API key required.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export const generateEmbedding = async (text) => {
  const embedder = await getEmbedder();
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
};

/**
 * Generates embeddings for multiple chunks.
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
export const generateEmbeddingsBatch = async (texts) => {
  const embedder = await getEmbedder();
  const embeddings = [];
  for (const text of texts) {
    const output = await embedder(text, { pooling: "mean", normalize: true });
    embeddings.push(Array.from(output.data));
  }
  return embeddings;
};
