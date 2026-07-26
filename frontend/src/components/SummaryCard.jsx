import { useState } from "react";
import api from "../services/api.js";
import Loader from "./Loader.jsx";
import "./SummaryCard.css";

const SummaryCard = ({ documentId, initialSummary, documentReady }) => {
  const [summary, setSummary] = useState(initialSummary || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post(`/documents/${documentId}/summary`);
      setSummary(data.summary);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't generate a summary. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!summary && !loading) {
    return (
      <div className="summary summary--empty card">
        <p className="summary__hand">Get the whole document in a few bullet points.</p>
        <button
          className="btn btn--primary"
          onClick={generateSummary}
          disabled={!documentReady}
        >
          {documentReady ? "Generate summary" : "Processing document..."}
        </button>
        {error && <p className="summary__error">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="summary card">
        <Loader label="Reading through your notes..." />
      </div>
    );
  }

  return (
    <div className="summary card">
      <div className="summary__header">
        <h3>Summary</h3>
        <button className="btn btn--ghost" onClick={generateSummary}>
          Regenerate
        </button>
      </div>
      <div className="summary__body">
        {summary.split("\n").map((line, i) =>
          line.trim() ? <p key={i}>{line}</p> : null
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
