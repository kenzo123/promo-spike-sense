import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { UploadCloud } from "lucide-react";

export default function QuickUploadWidget() {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3 h-full"
      style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
    >
      <h2 className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>Quick Upload</h2>

      <button
        onClick={() => navigate(createPageUrl("Upload"))}
        className="flex-1 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
        style={{
          background: "#111111",
          border: "2px dashed #2A2A2A",
          minHeight: 120,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#6366F1";
          e.currentTarget.style.background = "rgba(99,102,241,0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#2A2A2A";
          e.currentTarget.style.background = "#111111";
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "#1A1A1A" }}
        >
          <UploadCloud size={18} style={{ color: "#6366F1" }} />
        </div>
        <div className="text-center">
          <p className="text-xs font-medium" style={{ color: "#AAAAAA" }}>
            Drop CSV or click to upload
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#555555" }}>
            Opens the full upload page
          </p>
        </div>
      </button>
    </div>
  );
}