import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Save, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import WeatherSection from "../components/settings/WeatherSection";
import KeywordsSection from "../components/settings/KeywordsSection";
import NotificationsSection from "../components/settings/NotificationsSection";
import SubscriptionSection from "../components/settings/SubscriptionSection";
import GdprSection from "../components/settings/GdprSection";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [settingsId, setSettingsId] = useState(null);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const upgraded = urlParams.get("upgraded") === "true";

  const [form, setForm] = useState({
    weather_lat: 48.85,
    weather_lon: 2.35,
    trend_keywords: [],       // string[]
    slack_webhook_url: "",
    notification_email: "",
    email_alerts_enabled: true,
  });

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const u = await base44.auth.me();
    setUser(u);
    const data = await base44.entities.UserSettings.filter({ user_id: u.id });
    if (data.length > 0) {
      const s = data[0];
      setSettings(s);
      setSettingsId(s.id);
      let keywords = [];
      try { keywords = JSON.parse(s.trend_keywords || "[]"); } catch { keywords = []; }
      setForm({
        weather_lat: s.weather_lat ?? 48.85,
        weather_lon: s.weather_lon ?? 2.35,
        trend_keywords: Array.isArray(keywords) ? keywords : [],
        slack_webhook_url: s.slack_webhook_url || "",
        notification_email: s.notification_email || u.email || "",
        email_alerts_enabled: s.email_alerts_enabled !== false,
      });
    } else {
      setForm((f) => ({ ...f, notification_email: u.email || "" }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const u = await base44.auth.me();
    const payload = {
      user_id: u.id,
      weather_lat: form.weather_lat,
      weather_lon: form.weather_lon,
      trend_keywords: JSON.stringify(form.trend_keywords),
      slack_webhook_url: form.slack_webhook_url,
      notification_email: form.notification_email,
      email_alerts_enabled: form.email_alerts_enabled,
    };
    if (settingsId) {
      await base44.entities.UserSettings.update(settingsId, payload);
    } else {
      const created = await base44.entities.UserSettings.create(payload);
      setSettingsId(created.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleFieldChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    const result = await base44.functions.create_checkout_session({
      user_email: user.email,
      user_id: user.id,
      success_url: `${window.location.origin}${window.location.pathname}?upgraded=true`,
      cancel_url: `${window.location.origin}${window.location.pathname}`,
    });
    if (result?.url) window.location.href = result.url;
    setCheckoutLoading(false);
  };

  const plan = settings?.plan || "free";

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#F5F5F5" }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "#888888" }}>
          Configure forecasting context, notifications, and subscription.
        </p>
      </div>

      {/* Upgrade success banner */}
      {upgraded && (
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}
        >
          <Sparkles size={18} style={{ color: "#22C55E" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "#22C55E" }}>🎉 Welcome to Pro! Auto-refresh activated.</p>
            <p className="text-xs mt-0.5" style={{ color: "#AAAAAA" }}>Enjoy unlimited SKUs and daily forecasts.</p>
          </div>
        </div>
      )}

      <WeatherSection
        lat={form.weather_lat}
        lon={form.weather_lon}
        onChange={handleFieldChange}
      />

      <KeywordsSection
        keywords={form.trend_keywords}
        onChange={(kws) => handleFieldChange("trend_keywords", kws)}
      />

      <NotificationsSection
        email={form.notification_email}
        emailEnabled={form.email_alerts_enabled}
        slackWebhook={form.slack_webhook_url}
        onChange={handleFieldChange}
      />

      <SubscriptionSection
        plan={plan}
        user={user}
        stripeCustomerId={settings?.stripe_customer_id}
        onUpgrade={handleUpgrade}
        upgradeLoading={checkoutLoading}
      />

      <GdprSection
        settingsId={settingsId}
        user={user}
        settings={settings}
      />

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
        style={{
          background: saved ? "rgba(34,197,94,0.15)" : "#6366F1",
          color: saved ? "#22C55E" : "#fff",
          border: saved ? "1px solid rgba(34,197,94,0.3)" : "none",
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.8 : 1,
        }}
      >
        {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
          : saved ? <><CheckCircle2 size={14} /> Saved</>
          : <><Save size={14} /> Save Settings</>}
      </button>
    </div>
  );
}