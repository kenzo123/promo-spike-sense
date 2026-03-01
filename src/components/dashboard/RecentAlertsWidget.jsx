import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TrendingUp, TrendingDown, Upload, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function AlertRow({ alert }) {
  const isSpike = alert.alert_type === "spike";
  return (
    <div
      className="flex items-start gap-3 py-3 border-b last:border-b-0"
      style={{ borderColor: "#2A2A2A" }}
    >
      {/* SKU badge */}
      <span
        className="text-xs px-2 py-0.5 rounded font-mono flex-shrink-0 mt-0.5"
        style={{ background: "#222222", color: "#AAAAAA", border: "1px solid #2A2A2A" }}
      >
        {alert.sku_id}
      </span>

      {/* Type badge */}
      <span
        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5"
        style={
          isSpike
            ? { background: "rgba(245,158,11,0.12)", color: "#F59E0B" }
            : { background: "rgba(239,68,68,0.12)", color: "#EF4444" }
        }
      >
        {isSpike ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
        {isSpike ? "Spike" : "Risk"}
      </span>

      {/* Explanation */}
      <p className="text-xs flex-1 leading-relaxed" style={{ color: "#AAAAAA" }}>
        {alert.explanation || "No explanation available"}
      </p>

      {/* Date */}
      <span className="text-xs flex-shrink-0 flex items-center gap-1" style={{ color: "#555555" }}>
        <Clock size={10} />
        {formatDistanceToNow(new Date(alert.created_date), { addSuffix: true })}
      </span>
    </div>
  );
}

export default function RecentAlertsWidget({ alerts, loading }) {
  const recent = alerts.slice(0, 5);

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>Recent Alerts</h2>
        {alerts.length > 0 && (
          <Link
            to={createPageUrl("Alerts")}
            className="text-xs no-underline"
            style={{ color: "#6366F1" }}
          >
            View all →
          </Link>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 rounded-lg shimmer" />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "#222222" }}
          >
            <TrendingUp size={20} style={{ color: "#555555" }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "#888888" }}>No alerts yet</p>
            <p className="text-xs mt-0.5" style={{ color: "#555555" }}>
              Alerts appear here once you run a forecast
            </p>
          </div>
          <Link
            to={createPageUrl("Upload")}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg no-underline font-medium"
            style={{ background: "#6366F1", color: "#fff" }}
          >
            <Upload size={12} />
            Upload your first CSV to get started
          </Link>
        </div>
      ) : (
        <div>
          {recent.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}