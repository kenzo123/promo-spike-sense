import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, RefreshCw } from "lucide-react";

import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import RecentAlertsWidget from "../components/dashboard/RecentAlertsWidget";
import LastForecastWidget from "../components/dashboard/LastForecastWidget";
import QuickUploadWidget from "../components/dashboard/QuickUploadWidget";
import PlanStatusWidget from "../components/dashboard/PlanStatusWidget";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const u = await base44.auth.me();
    setUser(u);
    const [jobsData, alertsData, settingsData] = await Promise.all([
      base44.entities.ForecastJob.filter({ user_id: u.id }, "-created_date", 20),
      base44.entities.Alert.list("-created_date", 30),
      base44.entities.UserSettings.filter({ user_id: u.id }),
    ]);
    setJobs(jobsData);
    setAlerts(alertsData);
    setUserSettings(settingsData[0] || null);
    setLoading(false);
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const isFirstTime = !loading && jobs.length === 0 && alerts.length === 0;

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#F5F5F5" }}>
            {greeting}{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#888888" }}>
            Here's what's happening with your demand signals.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={loadData}
            className="h-9 w-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", cursor: "pointer" }}
            title="Refresh"
          >
            <RefreshCw size={14} style={{ color: "#888888" }} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            to={createPageUrl("Upload")}
            className="h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-1.5 no-underline"
            style={{ background: "#6366F1", color: "#fff" }}
          >
            <Plus size={14} />
            New Forecast
          </Link>
        </div>
      </div>

      {/* Welcome banner — first-time users only */}
      {isFirstTime && <WelcomeBanner />}

      {/* Widget 1: Recent Alerts (full width) */}
      <RecentAlertsWidget alerts={alerts} loading={loading} />

      {/* Widgets 2, 3, 4 — 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <LastForecastWidget jobs={jobs} loading={loading} />
        <QuickUploadWidget />
        <PlanStatusWidget userSettings={userSettings} loading={loading} />
      </div>
    </div>
  );
}