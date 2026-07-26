import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import UploadPDF from "../components/UploadPDF.jsx";
import Loader from "../components/Loader.jsx";
import "./Dashboard.css";

const statusLabel = {
  processing: { text: "Processing", className: "badge--processing" },
  ready: { text: "Ready", className: "badge--ready" },
  failed: { text: "Failed", className: "badge--failed" },
};

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDocuments = useCallback(async () => {
    try {
      const { data } = await api.get("/documents");
      setDocuments(data);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUploaded = (doc) => {
    setDocuments((prev) => [doc, ...prev]);
    navigate(`/documents/${doc._id}`);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this document and everything generated from it?")) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <p className="eyebrow">// your notebook</p>
          <h1>Your documents</h1>
        </div>
      </div>

      <UploadPDF onUploaded={handleUploaded} />

      <div className="dashboard__list">
        {loading ? (
          <Loader label="Loading your documents..." />
        ) : documents.length === 0 ? (
          <div className="dashboard__empty card">
            <p>No notes uploaded yet. Add a PDF above to get started.</p>
          </div>
        ) : (
          documents.map((doc) => {
            const status = statusLabel[doc.status] || statusLabel.processing;
            return (
              <div
                className="doc-card card"
                key={doc._id}
                onClick={() => navigate(`/documents/${doc._id}`)}
                role="button"
                tabIndex={0}
              >
                <div className="doc-card__main">
                  <h3>{doc.title}</h3>
                  <p className="doc-card__meta">
                    {doc.pageCount} page{doc.pageCount === 1 ? "" : "s"} · uploaded{" "}
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="doc-card__actions">
                  <span className={`badge ${status.className}`}>{status.text}</span>
                  <button
                    className="btn btn--danger"
                    onClick={(e) => handleDelete(doc._id, e)}
                    aria-label={`Delete ${doc.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
