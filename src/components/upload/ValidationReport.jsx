import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

function Section({ icon: Icon, color, label, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: `1px solid ${color}22` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ background: `${color}0A`, border: "none", cursor: "pointer" }}
      >
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color }} />
          <span className="text-sm font-medium" style={{ color: "#F5F5F5" }}>{label}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: `${color}20`, color }}
          >
            {count}
          </span>
        </div>
        {open ? <ChevronUp size={13} style={{ color: "#555555" }} /> : <ChevronDown size={13} style={{ color: "#555555" }} />}
      </button>
      {open && count > 0 && (
        <div className="px-4 pb-3 pt-1 space-y-1.5" style={{ background: "#111111" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function SkuRow({ sku, dateRange, rows, reason }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div>
        <span className="text-xs font-mono font-medium" style={{ color: "#F5F5F5" }}>{sku}</span>
        {dateRange && (
          <span className="text-xs ml-2" style={{ color: "#555555" }}>
            {dateRange.from} → {dateRange.to}
          </span>
        )}
        {reason && (
          <p className="text-xs mt-0.5" style={{ color: "#888888" }}>{reason}</p>
        )}
      </div>
      {rows !== undefined && (
        <span className="text-xs flex-shrink-0" style={{ color: "#555555" }}>{rows} rows</span>
      )}
    </div>
  );
}

export default function ValidationReport({ report, warnings }) {
  if (!report) return null;
  const { valid, degraded, rejected } = report;

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>Validation Report</p>

      {warnings?.length > 0 && (
        <div
          className="rounded-lg p-3 flex gap-2"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
        >
          <AlertTriangle size={13} style={{ color: "#F59E0B", flexShrink: 0, marginTop: 1 }} />
          <div className="space-y-0.5">
            {warnings.map((w, i) => (
              <p key={i} className="text-xs" style={{ color: "#F59E0B" }}>{w}</p>
            ))}
          </div>
        </div>
      )}

      <Section icon={CheckCircle2} color="#22C55E" label="Valid SKUs" count={valid.length} defaultOpen>
        {valid.map((s) => (
          <SkuRow key={s.sku} sku={s.sku} dateRange={s.dateRange} rows={s.rows} />
        ))}
      </Section>

      <Section icon={AlertTriangle} color="#F59E0B" label="Degraded SKUs" count={degraded.length} defaultOpen={degraded.length > 0}>
        {degraded.map((s) => (
          <SkuRow key={s.sku} sku={s.sku} rows={s.rows} reason={s.reason} />
        ))}
      </Section>

      <Section icon={XCircle} color="#EF4444" label="Rejected SKUs" count={rejected.length} defaultOpen={rejected.length > 0}>
        {rejected.map((s) => (
          <SkuRow key={s.sku} sku={s.sku} rows={s.rows} reason={s.reason} />
        ))}
      </Section>
    </div>
  );
}