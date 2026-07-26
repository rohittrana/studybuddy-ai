import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export default grok;