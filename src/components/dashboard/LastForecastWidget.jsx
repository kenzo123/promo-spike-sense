import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ExternalLink, Calendar, Cpu, Package, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const STATUS_STYLES = {
  done:       { bg: "rgba(34,197,94,0.12)",    color: "#22C55E", label: "Done" },
  processing: { bg: "rgba(99,102,241,0.12)",   color: "#818CF8", label: "Processing" },
  pending:    { bg: "rgba(99,102,241,0.08)",   color: "#6366F1", label: "Pending" },
  error:      { bg: "rgba(239,68,68,0.12)",    color: "#EF4444", label: "Error" },
};

export default function LastForecastWidget({ jobs, loading }) {
  const job = jobs?.[0];

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 h-full"
      style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
    >
      <h2 className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>Last Forecast</h2>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 rounded-lg shimmer" />
          ))}
        </div>
      ) : !job ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 gap-2">
          <p className="text-sm" style={{ color: "#555555" }}>No forecasts yet</p>
        </div>
      ) : (
        <>
          {/* Status badge */}
          {(() => {
            const s = STATUS_STYLES[job.status] || STATUS_STYLES.pending;
            return (
              <span
                className="self-start text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: s.bg, color: s.color }}
              >
                {s.label}
              </span>
            );
          })()}

          {/* Meta rows */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Calendar size={13} style={{ color: "#555555" }} />
              <span className="text-xs" style={{ color: "#888888" }}>
                {formatDistanceToNow(new Date(job.created_date), { addSuffix: true })}
              </span>
            </div>
            {job.model_used && (
              <div className="flex items-center gap-2">
                <Cpu size={13} style={{ color: "#555555" }} />
                <span className="text-xs" style={{ color: "#888888" }}>{job.model_used}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Package size={13} style={{ color: "#555555" }} />
              <span className="text-xs" style={{ color: "#888888" }}>
                {job.sku_count || 0} valid SKU{job.sku_count !== 1 ? "s" : ""}
                {job.degraded_sku_count > 0 && (
                  <span style={{ color: "#F59E0B" }}>
                    {" "}· {job.degraded_sku_count} degraded
                  </span>
                )}
              </span>
            </div>
            {job.error_message && (
              <div className="flex items-start gap-2">
                <AlertTriangle size={13} style={{ color: "#EF4444", flexShrink: 0, marginTop: 1 }} />
                <span className="text-xs" style={{ color: "#EF4444" }}>{job.error_message}</span>
              </div>
            )}
          </div>

          {/* View Results */}
          <Link
            to={createPageUrl(`Results?jobId=${job.id}`)}
            className="mt-auto flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg no-underline font-medium transition-all"
            style={{ background: "#222222", color: "#F5F5F5", border: "1px solid #2A2A2A" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2A2A2A")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#222222")}
          >
            <ExternalLink size={12} />
            View Results
          </Link>
        </>
      )}
    </div>
  );
}