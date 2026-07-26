import grok from "../config/grok.js";

const CHAT_MODEL = "llama-3.3-70b-versatile";

/**
 * Generates flashcards (front/back pairs) from document text.
 * @param {string} text
 * @param {number} numCards
 */
export const generateFlashcards = async (text, numCards = 10) => {
  const truncated = text.slice(0, 15000);

  const response = await grok.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content: `You are a flashcard generator for a study app. Create ${numCards} flashcards from the given notes, covering key terms, concepts, and facts.
Respond ONLY with valid JSON, no markdown fences, no extra text, in exactly this shape:
{
  "flashcards": [
    { "front": "term or question", "back": "concise definition or answer" }
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
  return parsed.flashcards;
};
