import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useState } from "react";

function AlertCard({ alert, onRate }) {
  const isSpike = alert.alert_type === "spike";
  const color = isSpike ? "#F59E0B" : "#EF4444";
  const bg = isSpike ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)";
  const Icon = isSpike ? TrendingUp : TrendingDown;

  return (
    <div
      className="rounded-lg p-4 space-y-2.5 transition-all"
      style={{ background: bg, border: `1px solid ${color}22` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}22` }}
          >
            <Icon size={11} style={{ color }} />
          </div>
          <div>
            <span className="text-xs font-semibold" style={{ color }}>
              {isSpike ? "SPIKE" : "RISK"}
            </span>
            <span className="text-xs ml-2" style={{ color: "#888888" }}>
              D+{alert.day_offset}
            </span>
          </div>
        </div>
        <span
          className="text-xs font-bold"
          style={{ color: isSpike ? "#22C55E" : "#EF4444" }}
        >
          {isSpike ? "+" : ""}{alert.pct_change?.toFixed(0)}%
        </span>
      </div>

      <div>
        <p className="text-xs font-medium" style={{ color: "#F5F5F5" }}>
          {alert.sku_name || alert.sku_id}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#888888" }}>
          {alert.explanation}
        </p>
      </div>

      {alert.qty_suggested && (
        <div
          className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded"
          style={{ background: "#0F0F0F" }}
        >
          <span style={{ color: "#888888" }}>Suggested qty</span>
          <span className="font-semibold" style={{ color: "#F5F5F5" }}>{alert.qty_suggested} units</span>
        </div>
      )}

      {/* Star rating */}
      <div className="flex items-center gap-1 pt-1">
        <span className="text-xs mr-1" style={{ color: "#555555" }}>Rate:</span>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => onRate(alert.id, s)}
            className="transition-transform hover:scale-110"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "1px" }}
          >
            <Star
              size={11}
              fill={alert.user_rating >= s ? color : "none"}
              style={{ color: alert.user_rating >= s ? color : "#3A3A3A" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AlertsFeed({ alerts, onUpdate }) {
  const handleRate = async (alertId, rating) => {
    await base44.entities.Alert.update(alertId, { user_rating: rating });
    if (onUpdate) onUpdate();
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div
        className="rounded-xl p-6 text-center"
        style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
      >
        <p className="text-sm" style={{ color: "#555555" }}>No alerts yet</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
    >
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "#2A2A2A" }}>
        <h3 className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>Latest Alerts</h3>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}
        >
          {alerts.length} active
        </span>
      </div>
      <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
        {alerts.slice(0, 10).map((alert) => (
          <AlertCard key={alert.id} alert={alert} onRate={handleRate} />
        ))}
      </div>
    </div>
  );
}