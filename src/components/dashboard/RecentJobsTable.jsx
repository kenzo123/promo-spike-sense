import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";

const STATUS_CONFIG = {
  pending:    { label: "Pending",    color: "#888888", bg: "#22222280", icon: Clock },
  processing: { label: "Processing", color: "#6366F1", bg: "rgba(99,102,241,0.12)", icon: Loader2 },
  done:       { label: "Done",       color: "#22C55E", bg: "rgba(34,197,94,0.12)",  icon: CheckCircle2 },
  error:      { label: "Error",      color: "#EF4444", bg: "rgba(239,68,68,0.12)",  icon: AlertCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={10} className={status === "processing" ? "animate-spin" : ""} />
      {cfg.label}
    </span>
  );
}

export default function RecentJobsTable({ jobs }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div
        className="rounded-xl flex flex-col items-center justify-center py-16 text-center"
        style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "rgba(99,102,241,0.1)" }}
        >
          <Clock size={20} style={{ color: "#6366F1" }} />
        </div>
        <p className="text-sm font-medium mb-1" style={{ color: "#F5F5F5" }}>No forecast jobs yet</p>
        <p className="text-xs mb-4" style={{ color: "#555555" }}>
          Upload a CSV to run your first forecast
        </p>
        <Link
          to={createPageUrl("Upload")}
          className="text-xs font-medium no-underline flex items-center gap-1"
          style={{ color: "#6366F1" }}
        >
          Get started <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: "#2A2A2A" }}>
        <h3 className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>Recent Forecast Jobs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #2A2A2A" }}>
              {["File", "Status", "SKUs", "Model", "Created", ""].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide"
                  style={{ color: "#555555" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, i) => (
              <tr
                key={job.id}
                className="transition-colors"
                style={{ borderBottom: i < jobs.length - 1 ? "1px solid #222222" : "none" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#1E1E1E"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <td className="px-5 py-3.5">
                  <span className="font-medium truncate max-w-[160px] block" style={{ color: "#F5F5F5" }}>
                    {job.file_name || `Job #${job.id?.slice(-6)}`}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-5 py-3.5" style={{ color: "#AAAAAA" }}>
                  {job.sku_count ?? "—"}
                  {job.degraded_sku_count > 0 && (
                    <span className="ml-1 text-xs" style={{ color: "#F59E0B" }}>
                      ({job.degraded_sku_count} ⚠)
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: "#222222", color: "#888888" }}
                  >
                    {job.model_used || "auto"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs" style={{ color: "#888888" }}>
                  {job.created_date
                    ? formatDistanceToNow(new Date(job.created_date), { addSuffix: true })
                    : "—"}
                </td>
                <td className="px-5 py-3.5">
                  {job.status === "done" && (
                    <Link
                      to={createPageUrl(`Results?jobId=${job.id}`)}
                      className="inline-flex items-center gap-1 text-xs font-medium no-underline transition-colors"
                      style={{ color: "#6366F1" }}
                    >
                      View <ArrowRight size={11} />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}