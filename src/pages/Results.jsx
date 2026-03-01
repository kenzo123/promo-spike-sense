import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, TrendingUp, TrendingDown, Loader2, AlertCircle, Package } from "lucide-react";
import ForecastChart from "../components/results/ForecastChart";
import AlertsFeed from "../components/dashboard/AlertsFeed";
import JobProgressBanner from "../components/results/JobProgressBanner";

function generateMockChartData(skuId) {
  const seed = skuId?.charCodeAt(0) || 50;
  const data = [];
  for (let i = -7; i <= 7; i++) {
    const base = seed + Math.sin(i * 0.5) * 10;
    const noise = (Math.random() - 0.5) * 8;
    data.push({
      day: i === 0 ? "Today" : i < 0 ? `D${i}` : `D+${i}`,
      actual: i <= 0 ? Math.max(0, Math.round(base + noise)) : undefined,
      forecast: i >= 0 ? Math.max(0, Math.round(base + noise + (i > 3 ? seed * 0.2 : 0))) : undefined,
    });
  }
  return data;
}

function SkuCard({ sku, alerts }) {
  const skuAlerts = alerts.filter((a) => a.sku_id === sku.sku_id);
  const chartData = generateMockChartData(sku.sku_id);
  const hasSpike = skuAlerts.some((a) => a.alert_type === "spike");
  const hasRisk = skuAlerts.some((a) => a.alert_type === "risk");

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
    >
      <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: "#2A2A2A" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#222222" }}
          >
            <Package size={14} style={{ color: "#888888" }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>
              {sku.sku_name || sku.sku_id}
            </p>
            <p className="text-xs" style={{ color: "#888888" }}>{sku.sku_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasSpike && (
            <span
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}
            >
              <TrendingUp size={10} /> Spike
            </span>
          )}
          {hasRisk && (
            <span
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}
            >
              <TrendingDown size={10} /> Risk
            </span>
          )}
        </div>
      </div>
      <div className="px-5 py-4">
        <ForecastChart data={chartData} />
      </div>
    </div>
  );
}

const TERMINAL_STATUSES = new Set(["done", "error"]);
const POLL_INTERVAL_MS = 3000;

export default function Results() {
  const [job, setJob] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get("jobId");

  useEffect(() => {
    if (!jobId) return;
    loadData();
    return () => clearInterval(pollRef.current);
  }, [jobId]);

  const loadData = async () => {
    setLoading(true);
    await pollOnce();
    setLoading(false);

    // Start polling
    pollRef.current = setInterval(async () => {
      const jobs = await base44.entities.ForecastJob.filter({ id: jobId });
      const jobData = jobs[0];
      setJob(jobData);
      if (TERMINAL_STATUSES.has(jobData?.status)) {
        clearInterval(pollRef.current);
        if (jobData?.status === "done") {
          const alertsData = await base44.entities.Alert.filter({ job_id: jobId }, "-created_date", 50);
          setAlerts(alertsData);
        }
      }
    }, POLL_INTERVAL_MS);
  };

  const pollOnce = async () => {
    const jobs = await base44.entities.ForecastJob.filter({ id: jobId });
    const jobData = jobs[0];
    setJob(jobData);
    if (jobData && TERMINAL_STATUSES.has(jobData.status)) {
      const alertsData = await base44.entities.Alert.filter({ job_id: jobId }, "-created_date", 50);
      setAlerts(alertsData);
    }
  };

  // Generate mock SKU list from result_json or show placeholder
  const skus = job?.result_json
    ? JSON.parse(job.result_json)?.skus || []
    : job?.sku_count > 0
    ? Array.from({ length: Math.min(job.sku_count, 6) }, (_, i) => ({
        sku_id: `SKU-${String(i + 1).padStart(3, "0")}`,
        sku_name: `Product ${i + 1}`,
      }))
    : [{ sku_id: "SKU-001", sku_name: "Sample Product" }];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 size={28} className="animate-spin mx-auto" style={{ color: "#6366F1" }} />
          <p className="text-sm" style={{ color: "#888888" }}>Loading forecast…</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertCircle size={28} className="mx-auto" style={{ color: "#EF4444" }} />
          <p className="text-sm" style={{ color: "#888888" }}>Job not found.</p>
          <Link to={createPageUrl("Dashboard")} className="text-sm no-underline" style={{ color: "#6366F1" }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={createPageUrl("Dashboard")}
          className="flex items-center gap-1.5 text-sm no-underline"
          style={{ color: "#888888" }}
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <span style={{ color: "#2A2A2A" }}>/</span>
        <span className="text-sm" style={{ color: "#F5F5F5" }}>{job.file_name || "Forecast Results"}</span>
      </div>

      {/* Status banner — always visible, shows live status */}
      <JobProgressBanner job={job} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div>
            <h2 className="text-base font-semibold mb-4" style={{ color: "#F5F5F5" }}>SKU Forecasts</h2>
            <div className="space-y-4">
              {skus.map((sku) => (
                <SkuCard key={sku.sku_id} sku={sku} alerts={alerts} />
              ))}
            </div>
          </div>
        </div>
        <div className="xl:col-span-1">
          <h2 className="text-base font-semibold mb-4" style={{ color: "#F5F5F5" }}>Alerts</h2>
          <AlertsFeed alerts={alerts} onUpdate={loadData} />
        </div>
      </div>
    </div>
  );
}