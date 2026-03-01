import { useState, useEffect } from "react";
import { Crown, CheckCircle2, Zap, RefreshCw, Loader2, ExternalLink, Receipt } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SectionCard from "./SectionCard";

const planBadge = (plan) => (
  <span
    className="text-xs px-2.5 py-1 rounded-full font-semibold"
    style={
      plan === "pro"
        ? { background: "rgba(99,102,241,0.15)", color: "#818CF8", border: "1px solid rgba(99,102,241,0.3)" }
        : { background: "#222222", color: "#888888", border: "1px solid #2A2A2A" }
    }
  >
    {plan === "pro" ? "Pro" : "Free"}
  </span>
);

export default function SubscriptionSection({ plan, user, stripeCustomerId, onUpgrade, upgradeLoading }) {
  const [invoices, setInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (plan === "pro" && stripeCustomerId) {
      fetchInvoices();
    }
  }, [plan, stripeCustomerId]);

  const fetchInvoices = async () => {
    setInvoicesLoading(true);
    const result = await base44.functions.get_invoices({ customer_id: stripeCustomerId }).catch(() => null);
    if (result?.invoices) setInvoices(result.invoices.slice(0, 3));
    setInvoicesLoading(false);
  };

  const openPortal = async () => {
    setPortalLoading(true);
    const result = await base44.functions.create_portal_session({
      customer_id: stripeCustomerId,
      return_url: window.location.href,
    }).catch(() => null);
    if (result?.url) window.location.href = result.url;
    setPortalLoading(false);
  };

  return (
    <SectionCard icon={Crown} title="Subscription" badge={planBadge(plan)}>
      {plan === "pro" ? (
        <div className="space-y-4">
          <div className="space-y-2.5">
            {[
              { icon: Zap, color: "#22C55E", label: "Unlimited SKUs per month" },
              { icon: RefreshCw, color: "#6366F1", label: "Auto-refresh daily at 2am UTC" },
              { icon: CheckCircle2, color: "#22C55E", label: "Email & Slack spike alerts" },
            ].map(({ icon: Icon, color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={13} style={{ color }} />
                <span className="text-sm" style={{ color: "#AAAAAA" }}>{label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={openPortal}
            disabled={portalLoading}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all"
            style={{ background: "#222222", color: "#F5F5F5", border: "1px solid #2A2A2A", cursor: portalLoading ? "not-allowed" : "pointer" }}
          >
            {portalLoading ? <Loader2 size={13} className="animate-spin" /> : <ExternalLink size={13} />}
            Manage Subscription
          </button>

          {/* Billing history */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "#888888" }}>BILLING HISTORY</p>
            {invoicesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 rounded shimmer" />
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <p className="text-xs" style={{ color: "#555555" }}>No invoices yet.</p>
            ) : (
              <div className="space-y-2">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                    style={{ background: "#222222" }}
                  >
                    <div className="flex items-center gap-2">
                      <Receipt size={11} style={{ color: "#555555" }} />
                      <span style={{ color: "#AAAAAA" }}>{new Date(inv.created * 1000).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ color: "#F5F5F5", fontWeight: 600 }}>€{(inv.amount_paid / 100).toFixed(2)}</span>
                      <a href={inv.hosted_invoice_url} target="_blank" rel="noreferrer" style={{ color: "#6366F1", textDecoration: "none" }}>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs" style={{ color: "#888888" }}>Free plan · 20 SKUs max · Manual forecasts only</p>
          <div
            className="rounded-lg p-4 space-y-3"
            style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>Upgrade to Pro — €49/month</p>
            <ul className="space-y-1.5">
              {["Unlimited SKUs", "Daily auto-refresh at 2am UTC", "Email & Slack alerts"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "#AAAAAA" }}>
                  <CheckCircle2 size={11} style={{ color: "#6366F1" }} /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={onUpgrade}
              disabled={upgradeLoading}
              className="w-full h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: "#6366F1", color: "#fff", cursor: upgradeLoading ? "not-allowed" : "pointer", opacity: upgradeLoading ? 0.8 : 1, border: "none" }}
            >
              {upgradeLoading ? <><Loader2 size={13} className="animate-spin" /> Redirecting…</> : <><Crown size={13} /> Upgrade to Pro</>}
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}