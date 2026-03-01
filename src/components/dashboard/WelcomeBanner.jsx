import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Upload, Download, Sparkles } from "lucide-react";

function generateSampleCSV() {
  const headers = "unique_id,ds,y,promo_flag,category";
  const rows = [];
  const skus = ["SKU-001", "SKU-002"];
  skus.forEach((sku) => {
    for (let i = 60; i >= 1; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      const y = Math.round(50 + Math.random() * 80);
      const promo = Math.random() > 0.85 ? 1 : 0;
      rows.push(`${sku},${ds},${y},${promo},electronics`);
    }
  });
  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample_sales_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function WelcomeBanner() {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(129,140,248,0.06) 100%)",
        border: "1px solid rgba(99,102,241,0.25)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(99,102,241,0.2)" }}
        >
          <Sparkles size={18} style={{ color: "#818CF8" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold" style={{ color: "#F5F5F5" }}>
            Welcome to PromoSpikeSense! 🎉
          </h2>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: "#AAAAAA" }}>
            Start by uploading your sales history CSV to generate D+1–D+14 demand forecasts and get
            alerted on spikes &amp; risks before they happen.
          </p>
          <p className="text-xs mt-1.5" style={{ color: "#666666" }}>
            Don't have data? Download our sample CSV to test the platform instantly.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Link
              to={createPageUrl("Upload")}
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg no-underline font-semibold"
              style={{ background: "#6366F1", color: "#fff" }}
            >
              <Upload size={14} />
              Upload CSV
            </Link>
            <button
              onClick={generateSampleCSV}
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg font-medium"
              style={{ background: "#222222", color: "#AAAAAA", border: "1px solid #2A2A2A", cursor: "pointer" }}
            >
              <Download size={14} />
              Download sample CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}