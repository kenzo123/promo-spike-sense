import { TrendingUp, TrendingDown, Zap, AlertTriangle, Package } from "lucide-react";

const StatCard = ({ label, value, sub, color, icon: Icon, trend }) => (
  <div
    className="rounded-xl p-5 flex flex-col gap-3"
    style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
  >
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium tracking-wide uppercase" style={{ color: "#555555" }}>
        {label}
      </span>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        <Icon size={13} style={{ color }} />
      </div>
    </div>
    <div>
      <div className="text-2xl font-bold" style={{ color: "#F5F5F5" }}>{value}</div>
      {sub && (
        <div className="text-xs mt-1 flex items-center gap-1" style={{ color: "#888888" }}>
          {trend === "up" && <TrendingUp size={11} style={{ color: "#22C55E" }} />}
          {trend === "down" && <TrendingDown size={11} style={{ color: "#EF4444" }} />}
          {sub}
        </div>
      )}
    </div>
  </div>
);

export default function StatsRow({ jobs, alerts }) {
  const doneJobs = jobs?.filter((j) => j.status === "done") || [];
  const totalSkus = doneJobs.reduce((acc, j) => acc + (j.sku_count || 0), 0);
  const spikeAlerts = alerts?.filter((a) => a.alert_type === "spike") || [];
  const riskAlerts = alerts?.filter((a) => a.alert_type === "risk") || [];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Jobs"
        value={jobs?.length || 0}
        sub={`${doneJobs.length} completed`}
        color="#6366F1"
        icon={Zap}
      />
      <StatCard
        label="SKUs Analyzed"
        value={totalSkus}
        sub="across all jobs"
        color="#22C55E"
        icon={Package}
        trend="up"
      />
      <StatCard
        label="Spike Alerts"
        value={spikeAlerts.length}
        sub="demand spikes detected"
        color="#F59E0B"
        icon={TrendingUp}
        trend={spikeAlerts.length > 0 ? "up" : undefined}
      />
      <StatCard
        label="Risk Alerts"
        value={riskAlerts.length}
        sub="potential drops"
        color="#EF4444"
        icon={AlertTriangle}
        trend={riskAlerts.length > 0 ? "down" : undefined}
      />
    </div>
  );
}