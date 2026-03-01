import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Zap, Mail, ArrowRight, Shield, TrendingUp, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!gdprConsent) {
      setError("Please accept the privacy policy to continue.");
      return;
    }
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await base44.auth.sendMagicLink(email);
      setSent(true);
    } catch (err) {
      setError("Failed to send magic link. Please try again.");
    }
    setLoading(false);
  };

  const handleGoogle = () => {
    if (!gdprConsent) {
      setError("Please accept the privacy policy to continue.");
      return;
    }
    base44.auth.loginWithGoogle();
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#0F0F0F" }}
    >
      {/* Left panel - branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: "#0F0F0F", borderRight: "1px solid #2A2A2A" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
          >
            <Zap size={16} color="#fff" fill="#fff" />
          </div>
          <span className="font-semibold text-base" style={{ color: "#F5F5F5" }}>
            Promo<span style={{ color: "#6366F1" }}>Spike</span>Sense
          </span>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: "#F5F5F5" }}>
              Predict demand spikes
              <br />
              <span style={{ color: "#6366F1" }}>before they happen.</span>
            </h1>
            <p className="text-base leading-relaxed" style={{ color: "#888888" }}>
              Ultra short-term forecasting for e-commerce sellers in volatile niches.
              D+1 to D+14 predictions powered by trends, weather & promo signals.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: TrendingUp, label: "Detect viral TikTok demand spikes", color: "#6366F1" },
              { icon: Sparkles, label: "Flash promo & weather-aware forecasts", color: "#22C55E" },
              { icon: Shield, label: "GDPR-compliant data handling", color: "#F59E0B" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon size={14} style={{ color }} />
                </div>
                <span className="text-sm" style={{ color: "#AAAAAA" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: "#555555" }}>
          © 2026 PromoSpikeSense · Privacy · Terms
        </p>
      </div>

      {/* Right panel - auth form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
            >
              <Zap size={14} color="#fff" fill="#fff" />
            </div>
            <span className="font-semibold text-sm" style={{ color: "#F5F5F5" }}>
              Promo<span style={{ color: "#6366F1" }}>Spike</span>Sense
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1" style={{ color: "#F5F5F5" }}>Welcome back</h2>
            <p className="text-sm" style={{ color: "#888888" }}>Sign in to your account to continue</p>
          </div>

          {sent ? (
            <div
              className="rounded-xl p-6 text-center space-y-3"
              style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "rgba(99,102,241,0.15)" }}
              >
                <Mail size={20} style={{ color: "#6366F1" }} />
              </div>
              <h3 className="font-semibold" style={{ color: "#F5F5F5" }}>Check your email</h3>
              <p className="text-sm" style={{ color: "#888888" }}>
                We sent a magic link to <strong style={{ color: "#F5F5F5" }}>{email}</strong>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Google OAuth */}
              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 h-11 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  color: "#F5F5F5",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3A3A3A"; e.currentTarget.style.background = "#222222"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.background = "#1A1A1A"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "#2A2A2A" }} />
                <span className="text-xs" style={{ color: "#555555" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "#2A2A2A" }} />
              </div>

              {/* Magic Link */}
              <form onSubmit={handleMagicLink} className="space-y-3">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 text-sm"
                  style={{
                    background: "#1A1A1A",
                    border: "1px solid #2A2A2A",
                    color: "#F5F5F5",
                  }}
                />

                {/* GDPR Consent */}
                <div className="flex items-start gap-2.5 pt-1">
                  <Checkbox
                    id="gdpr"
                    checked={gdprConsent}
                    onCheckedChange={setGdprConsent}
                    className="mt-0.5"
                    style={{ borderColor: "#3A3A3A" }}
                  />
                  <label htmlFor="gdpr" className="text-xs leading-relaxed cursor-pointer" style={{ color: "#888888" }}>
                    I agree to the{" "}
                    <span style={{ color: "#6366F1" }} className="cursor-pointer">Privacy Policy</span>{" "}
                    and{" "}
                    <span style={{ color: "#6366F1" }} className="cursor-pointer">Terms of Service</span>.
                    My data will be processed in accordance with GDPR regulations.
                  </label>
                </div>

                {error && (
                  <p className="text-xs" style={{ color: "#EF4444" }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: loading ? "#4B4DDB" : "#6366F1",
                    color: "#fff",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.8 : 1,
                  }}
                >
                  {loading ? "Sending..." : (
                    <>Send magic link <ArrowRight size={14} /></>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}