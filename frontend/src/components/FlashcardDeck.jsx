import { useState, useEffect, useCallback } from "react";
import api from "../services/api.js";
import Loader from "./Loader.jsx";
import "./FlashcardDeck.css";

const FlashcardDeck = ({ documentId, documentReady }) => {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const fetchCards = useCallback(async () => {
    try {
      const { data } = await api.get(`/flashcards/document/${documentId}`);
      setCards(data);
    } catch (err) {
      console.error("Failed to load flashcards", err);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const generateCards = async () => {
    setGenerating(true);
    setError("");
    try {
      const { data } = await api.post(`/flashcards/${documentId}/generate`, { numCards: 10 });
      setCards(data);
      setIndex(0);
      setFlipped(false);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't generate flashcards. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };

  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  };

  if (loading) {
    return (
      <div className="flashcards card">
        <Loader label="Loading flashcards..." />
      </div>
    );
  }

  if (generating) {
    return (
      <div className="flashcards card">
        <Loader label="Writing flashcards from your notes..." />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flashcards flashcards--empty card">
        <p className="flashcards__hand">Turn key terms into a deck you can drill.</p>
        <button className="btn btn--primary" onClick={generateCards} disabled={!documentReady}>
          {documentReady ? "Generate flashcards" : "Processing document..."}
        </button>
        {error && <p className="flashcards__error">{error}</p>}
      </div>
    );
  }

  const card = cards[index];

  return (
    <div className="flashcards card">
      <div className="flashcards__header">
        <span className="flashcards__count">
          {index + 1} / {cards.length}
        </span>
        <button className="btn btn--ghost" onClick={generateCards}>
          New deck
        </button>
      </div>

      <div
        className={`flashcard ${flipped ? "flashcard--flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
      >
        <div className="flashcard__inner">
          <div className="flashcard__face flashcard__face--front">
            <span className="flashcard__label">Term</span>
            <p>{card.front}</p>
          </div>
          <div className="flashcard__face flashcard__face--back">
            <span className="flashcard__label">Answer</span>
            <p>{card.back}</p>
          </div>
        </div>
      </div>
      <p className="flashcards__hint">Click the card to flip it</p>

      <div className="flashcards__nav">
        <button className="btn btn--ghost" onClick={prev}>
          ← Prev
        </button>
        <button className="btn btn--primary" onClick={next}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;
