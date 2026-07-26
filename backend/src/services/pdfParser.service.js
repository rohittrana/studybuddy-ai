import fs from "fs";
import { createRequire } from "module";

// pdf-parse is a CommonJS module; use createRequire for reliable interop under ESM
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Extracts text and metadata from a PDF file on disk.
 * @param {string} filePath - path to the uploaded PDF
 * @returns {Promise<{text: string, pageCount: number}>}
 */
export const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return {
    text: data.text,
    pageCount: data.numpages,
  };
};
