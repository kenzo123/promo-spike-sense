import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  pending:    { emoji: "📊", message: "Validating your data...",    color: "#888888", spin: true  },
  enriching:  { emoji: "🌐", message: "Fetching trend signals...", color: "#6366F1", spin: true  },
  processing: { emoji: "🧠", message: "Running AI forecast...",    color: "#818CF8", spin: true  },
  done:       { emoji: "✅", message: "Forecast ready!",           color: "#22C55E", spin: false },
  error:      { emoji: "❌", message: null,                        color: "#EF4444", spin: false },
};

// Animated dots for in-progress states
function Dots() {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 500);
    return () => clearInterval(id);
  }, []);
  return <span style={{ color: "#555555" }}>{dots}</span>;
}

export default function JobProgressBanner({ job }) {
  const config = STATUS_CONFIG[job?.status] ?? STATUS_CONFIG.pending;
  const isActive = config.spin;
  const message = job?.status === "error"
    ? `❌ Error: ${job.error_message || "Something went wrong"}`
    : `${config.emoji} ${config.message}`;

  return (
    <div
      className="rounded-xl p-4 flex items-center gap-3 transition-all"
      style={{
        background: job?.status === "done"
          ? "rgba(34,197,94,0.08)"
          : job?.status === "error"
          ? "rgba(239,68,68,0.08)"
          : "rgba(99,102,241,0.08)",
        border: `1px solid ${
          job?.status === "done"
            ? "rgba(34,197,94,0.25)"
            : job?.status === "error"
            ? "rgba(239,68,68,0.25)"
            : "rgba(99,102,241,0.25)"
        }`,
      }}
    >
      {isActive && (
        <Loader2 size={16} className="animate-spin flex-shrink-0" style={{ color: config.color }} />
      )}
      {job?.status === "done" && (
        <CheckCircle2 size={16} className="flex-shrink-0" style={{ color: config.color }} />
      )}
      {job?.status === "error" && (
        <AlertCircle size={16} className="flex-shrink-0" style={{ color: config.color }} />
      )}
      <p className="text-sm font-medium" style={{ color: config.color }}>
        {message}
        {isActive && <Dots />}
      </p>
    </div>
  );
}