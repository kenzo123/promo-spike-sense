import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";

export default function DropZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    onFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    onFile(null);
    inputRef.current.value = "";
  };

  return (
    <div
      className="relative rounded-xl transition-all cursor-pointer"
      style={{
        background: dragging ? "rgba(99,102,241,0.06)" : "#1A1A1A",
        border: `2px dashed ${dragging ? "#6366F1" : file ? "#22C55E" : "#2A2A2A"}`,
        minHeight: "200px",
      }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
        {file ? (
          <>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "rgba(34,197,94,0.12)" }}
            >
              <CheckCircle2 size={22} style={{ color: "#22C55E" }} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "#F5F5F5" }}>{file.name}</p>
            <p className="text-xs mb-3" style={{ color: "#888888" }}>
              {(file.size / 1024).toFixed(1)} KB
            </p>
            <button
              onClick={clearFile}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
              style={{ background: "#222222", color: "#888888", border: "1px solid #2A2A2A", cursor: "pointer" }}
            >
              <X size={11} /> Remove
            </button>
          </>
        ) : (
          <>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform"
              style={{ background: dragging ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)" }}
            >
              <Upload size={20} style={{ color: "#6366F1" }} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "#F5F5F5" }}>
              {dragging ? "Drop to upload" : "Drop your CSV here"}
            </p>
            <p className="text-xs" style={{ color: "#888888" }}>
              or <span style={{ color: "#6366F1" }}>click to browse</span> · CSV up to 10MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}