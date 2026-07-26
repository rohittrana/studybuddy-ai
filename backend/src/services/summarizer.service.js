import grok from "../config/grok.js";

const CHAT_MODEL = "llama-3.3-70b-versatile"; // fast + cheap, good for summaries/Q&A

/**
 * Generates a concise study summary from document text.
 * Truncates very long text to stay within a safe token budget.
 * @param {string} text
 */
export const generateSummary = async (text) => {
  const truncated = text.slice(0, 15000); // keep prompt size reasonable

  const response = await grok.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful study assistant. Summarize the given lecture notes/text into clear, well-organized bullet points a student can quickly review. Group related ideas under short headings.",
      },
      { role: "user", content: truncated },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
};

/**
 * Answers a question using only the provided context chunks (RAG).
 * @param {string} question
 * @param {string[]} contextChunks
 */
export const answerQuestion = async (question, contextChunks) => {
  const context = contextChunks.join("\n\n---\n\n");

  const response = await grok.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are StudyBuddy AI, a helpful tutor. Answer the student's question using ONLY the provided context from their notes. If the answer isn't in the context, say you don't have enough information in the uploaded notes. Keep answers clear and student-friendly.",
      },
      {
        role: "user",
        content: `Context from notes:\n${context}\n\nQuestion: ${question}`,
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
};
