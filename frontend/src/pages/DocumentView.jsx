import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";
import ChatBox from "../components/ChatBox.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import QuizView from "../components/QuizView.jsx";
import FlashcardDeck from "../components/FlashcardDeck.jsx";
import "./DocumentView.css";

const TABS = [
  { key: "chat", label: "Chat" },
  { key: "summary", label: "Summary" },
  { key: "quiz", label: "Quiz" },
  { key: "flashcards", label: "Flashcards" },
];

const DocumentView = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");

  const fetchDoc = useCallback(async () => {
    try {
      const { data } = await api.get(`/documents/${id}`);
      setDoc(data);
    } catch (err) {
      console.error("Failed to load document", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  // Poll while the document is still being processed (chunked + embedded)
  useEffect(() => {
    if (doc?.status !== "processing") return;
    const interval = setInterval(fetchDoc, 4000);
    return () => clearInterval(interval);
  }, [doc?.status, fetchDoc]);

  if (loading) {
    return (
      <div className="doc-view doc-view--loading">
        <Loader label="Loading document..." />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="doc-view doc-view--loading">
        <p>Document not found. <Link to="/dashboard">Back to your notes</Link></p>
      </div>
    );
  }

  const documentReady = doc.status === "ready";

  return (
    <div className="doc-view">
      <div className="doc-view__header">
        <Link to="/dashboard" className="doc-view__back">
          ← Back
        </Link>
        <h1>{doc.title}</h1>
        {!documentReady && (
          <p className="doc-view__processing">
            Still processing this document — chat, quizzes, and flashcards will unlock shortly.
          </p>
        )}
      </div>

      <div className="doc-view__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`doc-view__tab ${activeTab === tab.key ? "doc-view__tab--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="doc-view__content">
        {activeTab === "chat" && <ChatBox documentId={doc._id} documentReady={documentReady} />}
        {activeTab === "summary" && (
          <SummaryCard documentId={doc._id} initialSummary={doc.summary} documentReady={documentReady} />
        )}
        {activeTab === "quiz" && <QuizView documentId={doc._id} documentReady={documentReady} />}
        {activeTab === "flashcards" && (
          <FlashcardDeck documentId={doc._id} documentReady={documentReady} />
        )}
      </div>
    </div>
  );
};

export default DocumentView;
