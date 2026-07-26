import { useState, useRef, useEffect } from "react";
import api from "../services/api.js";
import "./ChatBox.css";

const ChatBox = ({ documentId, documentReady }) => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || asking) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuestion("");
    setAsking(true);

    try {
      const { data } = await api.post(`/chat/${documentId}`, { question: q });
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            err.response?.data?.message ||
            "Something went wrong answering that. Try again in a moment.",
          isError: true,
        },
      ]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="chat">
      <div className="chat__messages">
        {messages.length === 0 && (
          <div className="chat__empty">
            <p className="chat__empty-hand">Ask me anything about this document...</p>
            <p>Try: "Summarize section 2" or "What's the key formula here?"</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`chat__bubble chat__bubble--${m.role}`}>
            {m.role === "assistant" && <span className="chat__label">StudyBuddy</span>}
            <p className={m.isError ? "chat__error-text" : ""}>{m.text}</p>
          </div>
        ))}
        {asking && (
          <div className="chat__bubble chat__bubble--assistant chat__bubble--typing">
            <span className="chat__label">StudyBuddy</span>
            <span className="chat__typing">
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form className="chat__form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={documentReady ? "Ask a question about your notes..." : "Still processing your document..."}
          disabled={!documentReady || asking}
        />
        <button className="btn btn--primary" type="submit" disabled={!documentReady || asking || !question.trim()}>
          Ask
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
