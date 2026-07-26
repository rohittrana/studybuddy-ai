import grok from "../config/grok.js";

const CHAT_MODEL = "llama-3.3-70b-versatile";

/**
 * Generates a multiple-choice quiz from document text.
 * Returns an array of { question, options[4], correctAnswer, explanation }.
 * @param {string} text
 * @param {number} numQuestions
 */
export const generateQuiz = async (text, numQuestions = 5) => {
  const truncated = text.slice(0, 15000);

  const response = await grok.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content: `You are a quiz generator for a study app. Create ${numQuestions} multiple-choice questions from the given notes.
Respond ONLY with valid JSON, no markdown fences, no extra text, in exactly this shape:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string (must exactly match one of the options)",
      "explanation": "string, 1-2 sentences"
    }
  ]
}`,
      },
      { role: "user", content: truncated },
    ],
    temperature: 0.4,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return parsed.questions;
};
