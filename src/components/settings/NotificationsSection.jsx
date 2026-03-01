import { useState } from "react";
import { Bell, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import SectionCard from "./SectionCard";

export default function NotificationsSection({ email, emailEnabled, slackWebhook, onChange }) {
  const [slackTesting, setSlackTesting] = useState(false);
  const [slackTestResult, setSlackTestResult] = useState(null); // "ok" | "error"

  const testSlack = async () => {
    if (!slackWebhook) return;
    setSlackTesting(true);
    setSlackTestResult(null);
    const res = await fetch(slackWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "✅ PromoSpikeSense connected successfully!" }),
    }).catch(() => null);
    setSlackTestResult(res?.ok ? "ok" : "error");
    setSlackTesting(false);
  };

  return (
    <SectionCard icon={Bell} title="Notifications">
      {/* Email toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "#F5F5F5" }}>Email spike alerts</p>
          <p className="text-xs mt-0.5" style={{ color: "#888888" }}>Send email when a new spike alert is detected</p>
        </div>
        <Switch
          checked={!!emailEnabled}
          onCheckedChange={(v) => onChange("email_alerts_enabled", v)}
        />
      </div>

      {/* Email address */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium" style={{ color: "#888888" }}>Notification email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => onChange("notification_email", e.target.value)}
          placeholder="you@example.com"
          className="h-9 text-sm"
          style={{ background: "#222222", border: "1px solid #2A2A2A", color: "#F5F5F5" }}
        />
      </div>

      {/* Slack webhook */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium" style={{ color: "#888888" }}>Slack webhook URL</label>
        <div className="flex gap-2">
          <Input
            value={slackWebhook}
            onChange={(e) => onChange("slack_webhook_url", e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            className="h-9 text-sm flex-1"
            style={{ background: "#222222", border: "1px solid #2A2A2A", color: "#F5F5F5" }}
          />
          <button
            onClick={testSlack}
            disabled={!slackWebhook || slackTesting}
            className="h-9 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
            style={{
              background: slackTestResult === "ok" ? "rgba(34,197,94,0.15)" : slackTestResult === "error" ? "rgba(239,68,68,0.12)" : "#2A2A2A",
              color: slackTestResult === "ok" ? "#22C55E" : slackTestResult === "error" ? "#EF4444" : "#F5F5F5",
              border: "none",
              cursor: !slackWebhook || slackTesting ? "not-allowed" : "pointer",
              opacity: !slackWebhook ? 0.5 : 1,
            }}
          >
            {slackTesting ? <Loader2 size={12} className="animate-spin" /> : slackTestResult === "ok" ? <CheckCircle2 size={12} /> : slackTestResult === "error" ? <AlertCircle size={12} /> : null}
            {slackTesting ? "Testing…" : slackTestResult === "ok" ? "Sent!" : slackTestResult === "error" ? "Failed" : "Test"}
          </button>
        </div>
        <p className="text-xs" style={{ color: "#555555" }}>
          Sends a test message: "✅ PromoSpikeSense connected successfully"
        </p>
      </div>
    </SectionCard>
  );
}