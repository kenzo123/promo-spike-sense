import { Crown, Zap, RefreshCw } from "lucide-react";

const FREE_LIMIT = 20;

export default function PlanStatusWidget({ userSettings, loading }) {
  const plan = userSettings?.plan || "free";
  // In real usage you'd track actual SKUs used this month; use a placeholder for now
  const skusUsed = 0;
  const skusRemaining = FREE_LIMIT - skusUsed;
  const pct = Math.min(100, (skusUsed / FREE_LIMIT) * 100);

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 h-full"
      style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>Plan Status</h2>
        {plan === "pro" && (
          <span
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: "rgba(99,102,241,0.15)", color: "#818CF8", border: "1px solid rgba(99,102,241,0.3)" }}
          >
            <Crown size={10} /> Pro
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-8 rounded-lg shimmer" />
          ))}
        </div>
      ) : plan === "pro" ? (
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <Zap size={13} style={{ color: "#22C55E" }} />
            <span className="text-xs" style={{ color: "#AAAAAA" }}>Unlimited SKUs</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw size={13} style={{ color: "#6366F1" }} />
            <span className="text-xs" style={{ color: "#AAAAAA" }}>Auto-refresh: daily at 2am UTC</span>
          </div>
          <div
            className="rounded-lg p-3 mt-2"
            style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
          >
            <p className="text-xs" style={{ color: "#22C55E" }}>
              ✓ Full access — all features unlocked
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col">
          {/* Usage bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs" style={{ color: "#888888" }}>SKUs this month</span>
              <span className="text-xs font-semibold" style={{ color: "#F5F5F5" }}>
                {skusUsed} / {FREE_LIMIT}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#2A2A2A" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: pct > 80 ? "#EF4444" : "#6366F1",
                }}
              />
            </div>
            <p className="text-xs mt-1.5" style={{ color: "#555555" }}>
              {skusRemaining} SKUs remaining this month
            </p>
          </div>

          {/* Upgrade */}
          <button
            className="mt-auto w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-lg font-semibold transition-all"
            style={{ background: "rgba(99,102,241,0.15)", color: "#818CF8", border: "1px solid rgba(99,102,241,0.3)", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
          >
            <Crown size={12} />
            Upgrade to Pro — Unlimited SKUs
          </button>
        </div>
      )}
    </div>
  );
}