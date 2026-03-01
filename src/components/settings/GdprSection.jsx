import { useState } from "react";
import { Shield, Download, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import SectionCard from "./SectionCard";

function DeleteModal({ onClose, onConfirm, loading }) {
  const [text, setText] = useState("");
  const ready = text === "DELETE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-md rounded-xl p-6 space-y-4" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.1)" }}>
            <AlertTriangle size={16} style={{ color: "#EF4444" }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>Delete account permanently</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#888888" }}>
              This will permanently delete your account, all uploaded data, forecasts, and alerts. This cannot be undone. Your data will be removed within 30 days.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: "#888888" }}>
            Type <span style={{ color: "#EF4444", fontFamily: "monospace" }}>DELETE</span> to confirm
          </label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="DELETE"
            className="h-9 text-sm font-mono"
            style={{ background: "#222222", border: "1px solid #2A2A2A", color: "#F5F5F5" }}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-lg text-sm font-medium"
            style={{ background: "#222222", color: "#F5F5F5", border: "1px solid #2A2A2A", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!ready || loading}
            className="flex-1 h-9 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all"
            style={{
              background: ready ? "rgba(239,68,68,0.15)" : "#222222",
              color: ready ? "#EF4444" : "#555555",
              border: ready ? "1px solid rgba(239,68,68,0.3)" : "1px solid #2A2A2A",
              cursor: !ready || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            {loading ? "Processing…" : "Delete my account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GdprSection({ settingsId, user, settings }) {
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleExport = async () => {
    setExportLoading(true);
    // Gather all user data
    const [jobs, alerts, userSettings] = await Promise.all([
      base44.entities.ForecastJob.filter({ user_id: user.id }),
      base44.entities.Alert.list(),
      base44.entities.UserSettings.filter({ user_id: user.id }),
    ]);

    const exportData = {
      user: { id: user.id, email: user.email, full_name: user.full_name },
      settings: userSettings,
      forecast_jobs: jobs.map(({ result_json, ...rest }) => rest), // exclude raw result_json
      alerts,
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `promospikesense-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportLoading(false);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    if (settingsId) {
      await base44.entities.UserSettings.update(settingsId, {
        gdpr_deletion_requested_at: new Date().toISOString(),
      });
    }
    // Send confirmation email
    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: "Account deletion request received — PromoSpikeSense",
      body: `Hi ${user.full_name || ""},\n\nWe have received your account deletion request. Your data will be permanently removed within 30 days.\n\nIf this was a mistake, contact us immediately at support@promospikesense.com.\n\nPromoSpikeSense`,
    }).catch(() => {});
    setDeleteLoading(false);
    setShowModal(false);
    setDeleted(true);
    setTimeout(() => base44.auth.logout(), 3000);
  };

  if (deleted) {
    return (
      <SectionCard icon={Shield} title="Privacy & GDPR">
        <div className="text-center py-4 space-y-2">
          <p className="text-sm font-semibold" style={{ color: "#22C55E" }}>Deletion request submitted</p>
          <p className="text-xs" style={{ color: "#888888" }}>Your data will be removed within 30 days. You'll be signed out shortly.</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <>
      {showModal && (
        <DeleteModal
          onClose={() => setShowModal(false)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
      <SectionCard icon={Shield} title="Privacy & GDPR">
        <p className="text-xs" style={{ color: "#888888" }}>
          Under GDPR Article 15 &amp; 17, you have the right to access and erase your personal data.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-sm font-medium transition-all flex-1"
            style={{ background: "#222222", color: "#F5F5F5", border: "1px solid #2A2A2A", cursor: exportLoading ? "not-allowed" : "pointer" }}
          >
            {exportLoading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            Export my data
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-sm font-medium flex-1"
            style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer" }}
          >
            <Trash2 size={13} />
            Delete my account
          </button>
        </div>
        {settings?.gdpr_deletion_requested_at && (
          <p className="text-xs" style={{ color: "#F59E0B" }}>
            ⚠️ Deletion requested on {new Date(settings.gdpr_deletion_requested_at).toLocaleDateString()}. Data will be removed within 30 days.
          </p>
        )}
      </SectionCard>
    </>
  );
}