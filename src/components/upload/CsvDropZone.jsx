import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";

export default function CsvDropZone({ onFile, uploading, uploadProgress }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f || !f.name.endsWith(".csv")) return;
    setFile(f);
    onFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    onFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="rounded-xl transition-all"
        style={{
          border: `2px dashed ${dragging ? "#6366F1" : file ? "#2A2A2A" : "#2A2A2A"}`,
          background: dragging ? "rgba(99,102,241,0.06)" : file ? "#1A1A1A" : "#111111",
          cursor: file ? "default" : "pointer",
          minHeight: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        {!file ? (
          <div className="text-center space-y-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
              style={{ background: "rgba(99,102,241,0.1)" }}
            >
              <Upload size={18} style={{ color: "#6366F1" }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "#F5F5F5" }}>
                Drop your CSV here or <span style={{ color: "#6366F1" }}>browse</span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#555555" }}>Only .csv files accepted</p>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(99,102,241,0.12)" }}
              >
                <FileText size={16} style={{ color: "#6366F1" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#F5F5F5" }}>{file.name}</p>
                <p className="text-xs" style={{ color: "#888888" }}>{formatSize(file.size)}</p>
              </div>
              {!uploading && (
                <button
                  onClick={removeFile}
                  className="p-1 rounded-md"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#555555" }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {uploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs" style={{ color: "#888888" }}>
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={11} className="animate-spin" /> Uploading…
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "#2A2A2A" }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%`, background: "#6366F1" }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}