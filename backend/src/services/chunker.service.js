/**
 * Splits a large text into overlapping chunks, roughly by word count.
 * Overlap helps preserve context across chunk boundaries.
 * @param {string} text
 * @param {number} chunkSize - approx words per chunk
 * @param {number} overlap - words to overlap between chunks
 * @returns {string[]}
 */
export const splitTextIntoChunks = (text, chunkSize = 300, overlap = 50) => {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];

  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunk = words.slice(start, end).join(" ");
    if (chunk.trim().length > 0) chunks.push(chunk);
    if (end === words.length) break;
    start += chunkSize - overlap;
  }

  return chunks;
};
