import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, TrendingDown, Filter, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => { loadAlerts(); }, []);

  const loadAlerts = async () => {
    setLoading(true);
    const data = await base44.entities.Alert.list("-created_date", 100);
    setAlerts(data);
    setLoading(false);
  };

  const handleRate = async (id, rating) => {
    await base44.entities.Alert.update(id, { user_rating: rating });
    loadAlerts();
  };

  const filtered = alerts.filter((a) => {
    if (typeFilter !== "all" && a.alert_type !== typeFilter) return false;
    if (ratingFilter === "rated" && !a.user_rating) return false;
    if (ratingFilter === "unrated" && a.user_rating) return false;
    return true;
  });

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#F5F5F5" }}>Alerts</h1>
          <p className="text-sm mt-0.5" style={{ color: "#888888" }}>
            All demand spikes and risk signals across your forecasts.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={13} style={{ color: "#555555" }} />
          <span className="text-xs" style={{ color: "#555555" }}>Filter:</span>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger
            className="h-8 text-xs w-32"
            style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#F5F5F5" }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#F5F5F5" }}>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="spike">Spikes only</SelectItem>
            <SelectItem value="risk">Risks only</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger
            className="h-8 text-xs w-36"
            style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#F5F5F5" }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#F5F5F5" }}>
            <SelectItem value="all">All ratings</SelectItem>
            <SelectItem value="rated">Rated</SelectItem>
            <SelectItem value="unrated">Unrated</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs ml-auto" style={{ color: "#555555" }}>
          {filtered.length} alert{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-xl h-16 shimmer" style={{ border: "1px solid #2A2A2A" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
        >
          <p className="text-sm" style={{ color: "#555555" }}>No alerts match your filters.</p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #2A2A2A" }}>
                  {["Type", "SKU", "Day", "Change", "Qty", "Explanation", "Rating", "Age"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide"
                      style={{ color: "#555555" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((alert, i) => {
                  const isSpike = alert.alert_type === "spike";
                  const color = isSpike ? "#F59E0B" : "#EF4444";
                  const Icon = isSpike ? TrendingUp : TrendingDown;
                  return (
                    <tr
                      key={alert.id}
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid #222222" : "none" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#1E1E1E"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ background: `${color}15`, color }}
                        >
                          <Icon size={10} />
                          {isSpike ? "Spike" : "Risk"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono" style={{ color: "#AAAAAA" }}>
                          {alert.sku_id}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#888888" }}>
                        D+{alert.day_offset}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold" style={{ color: isSpike ? "#22C55E" : "#EF4444" }}>
                          {isSpike ? "+" : ""}{alert.pct_change?.toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#888888" }}>
                        {alert.qty_suggested ? `${alert.qty_suggested} u.` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: "#888888" }}>
                        {alert.explanation || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              onClick={() => handleRate(alert.id, s)}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: "1px" }}
                            >
                              <Star
                                size={10}
                                fill={alert.user_rating >= s ? color : "none"}
                                style={{ color: alert.user_rating >= s ? color : "#3A3A3A" }}
                              />
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#555555" }}>
                        {alert.created_date
                          ? formatDistanceToNow(new Date(alert.created_date), { addSuffix: true })
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}