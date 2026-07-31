# 📚 StudyBuddy AI

**StudyBuddy AI** is an AI-powered learning platform where students upload their PDF notes and ask questions in natural language. It uses a Retrieval-Augmented Generation (RAG) pipeline to provide instant, notes-grounded answers, along with AI-generated summaries, quizzes, and flashcards — helping students study faster and retain more.

🔗 **Live demo:** [studybuddy-ai-alpha.vercel.app](https://studybuddy-ai-alpha.vercel.app)
🔗 **Backend API:** [studybuddy-ai-e1y1.onrender.com](https://studybuddy-ai-e1y1.onrender.com)

---

## ✨ Features

- 📎 **PDF Upload** — drag-and-drop your lecture notes, readings, or slides
- 💬 **Chat with your notes** — ask questions in plain English, get answers grounded in *your* material (not the open internet)
- 📝 **Instant summaries** — organized bullet-point recaps of the whole document
- 🧠 **AI-generated quizzes** — multiple-choice questions created directly from your notes, with instant scoring
- 🗂️ **Flashcards** — auto-generated term/answer decks with a flip animation, for quick review
- 🔐 **Authentication** — secure signup/login with JWT and hashed passwords

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (jsonwebtoken, bcryptjs)
- Multer (file uploads)
- pdf-parse (PDF text extraction)

**AI / RAG Pipeline**
- [Grok API (xAI)](https://x.ai/) — chat completions, summaries, quiz & flashcard generation
- [`@xenova/transformers`](https://github.com/xenova/transformers.js) — local, free embedding generation (no API key required)
- Cosine similarity search for retrieving relevant note chunks before answering questions

**Deployment**
- Backend hosted on [Render](https://render.com)
- Frontend hosted on [Vercel](https://vercel.com)
- Database hosted on [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 🧩 How It Works

1. **Upload** — user uploads a PDF; the backend extracts its text using `pdf-parse`.
2. **Chunk & Embed** — the text is split into overlapping chunks, and each chunk is converted into a vector embedding **locally**, using a small open-source model (no cost, no API key).
3. **Ask a question** — the question is embedded the same way, then compared against all chunk embeddings using cosine similarity to find the most relevant pieces of the document.
4. **Generate an answer** — only those relevant chunks (not the whole document) are sent to Grok along with the question, so answers stay accurate and grounded in the source material.
5. **Summaries, quizzes, flashcards** — generated on demand by prompting Grok with the document's text and parsing its structured JSON response.

This is the standard **RAG (Retrieval-Augmented Generation)** pattern — it reduces hallucination and avoids sending an entire document to the LLM on every request.

---

## 📁 Project Structure

```
studybuddy-ai/
├── backend/
│   ├── src/
│   │   ├── config/          # DB + Grok client setup
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routes
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # PDF parsing, chunking, embeddings, AI generation
│   │   └── middleware/      # Auth, upload handling, error handling
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, ChatBox, QuizView, FlashcardDeck, etc.
│   │   ├── pages/           # Home, Login, Signup, Dashboard, DocumentView
│   │   ├── context/         # Auth context
│   │   ├── hooks/           # useAuth
│   │   └── services/        # Axios API client
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- A [Grok API key](https://x.ai/) from xAI

### 1. Clone the repo
```bash
git clone https://github.com/YOUR-USERNAME/studybuddy-ai.git
cd studybuddy-ai
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/studybuddy
JWT_SECRET=your_long_random_secret
GROK_API_KEY=your_xai_grok_api_key
CLIENT_URL=http://localhost:5173
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
cp .env.example .env
```

Fill in `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm run dev
```

The app will be running at `http://localhost:5173`, connected to the backend at `http://localhost:5000`.

---

## 🌐 Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Root directory: `frontend` |
| Backend | Render | Root directory: `backend`, Build: `npm install`, Start: `npm start` |
| Database | MongoDB Atlas | Free M0 cluster, network access set to allow all IPs (`0.0.0.0/0`) since hosts have dynamic IPs |

Environment variables must be set on each platform's dashboard — see `.env.example` files in each folder for the full list.

> ⚠️ Note: the free tiers of Render and MongoDB Atlas may cause the backend to "sleep" after inactivity, so the first request after idling can take 30–50 seconds.

---

## 🔑 Environment Variables

**Backend (`backend/.env`)**

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on (default `5000`) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `GROK_API_KEY` | xAI Grok API key |
| `CLIENT_URL` | Frontend URL, used for CORS |

**Frontend (`frontend/.env`)**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

---

## 📄 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Create an account |
| `POST` | `/api/auth/login` | Log in |
| `POST` | `/api/documents/upload` | Upload a PDF |
| `GET` | `/api/documents` | List user's documents |
| `POST` | `/api/documents/:id/summary` | Generate a summary |
| `POST` | `/api/chat/:documentId` | Ask a question about a document |
| `POST` | `/api/quizzes/:documentId/generate` | Generate a quiz |
| `POST` | `/api/flashcards/:documentId/generate` | Generate flashcards |

All routes except signup/login require a `Bearer` token in the `Authorization` header.

---

## 🗺️ Roadmap / Future Improvements

- [ ] Support for multiple file formats (DOCX, PPTX)
- [ ] Spaced-repetition scheduling for flashcards
- [ ] Multi-document chat (ask questions across several uploads at once)
- [ ] Shareable quiz links for group study
- [ ] Progress tracking / study analytics dashboard

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙋 Author

Built by [Your Name](https://github.com/YOUR-USERNAME) as a personal project.
