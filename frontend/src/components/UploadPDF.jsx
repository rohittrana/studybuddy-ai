import { useState, useRef } from "react";
import api from "../services/api.js";
import "./UploadPDF.css";

const UploadPDF = ({ onUploaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      const { data } = await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded?.(data);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div
      className={`upload ${dragActive ? "upload--active" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {uploading ? (
        <>
          <span className="upload__icon">⏳</span>
          <p className="upload__title">Reading your notes...</p>
          <p className="upload__hint">Extracting text and preparing it for questions.</p>
        </>
      ) : (
        <>
          <span className="upload__icon">📎</span>
          <p className="upload__title">Drop a PDF here, or click to browse</p>
          <p className="upload__hint">Lecture slides, readings, typed notes — up to 20MB.</p>
        </>
      )}
      {error && <p className="upload__error">{error}</p>}
    </div>
  );
};

export default UploadPDF;
