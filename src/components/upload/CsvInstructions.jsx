import { Download, Hash, Calendar, TrendingUp, Tag, Megaphone } from "lucide-react";

const REQUIRED = [
  { col: "unique_id", type: "text", desc: "Product/SKU identifier", icon: Hash },
  { col: "ds", type: "date", desc: "Date in YYYY-MM-DD format", icon: Calendar },
  { col: "y", type: "number ≥ 0", desc: "Daily sales quantity", icon: TrendingUp },
];

const OPTIONAL = [
  { col: "promo_flag", type: "0 or 1", desc: "Was a promotion active?", icon: Megaphone },
  { col: "category", type: "text", desc: "Product category for trend analysis", icon: Tag },
];

function generateSampleCsv() {
  const skus = ["SKU_FASHION_01", "SKU_BEAUTY_02", "SKU_DROP_03"];
  const categories = ["fashion", "beauty", "dropshipping"];
  const rows = ["unique_id,ds,y,promo_flag,category"];
  const baseDate = new Date("2025-09-01");

  skus.forEach((sku, si) => {
    for (let d = 0; d < 60; d++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + d);
      const ds = date.toISOString().split("T")[0];
      const base = 20 + si * 10;
      const seasonality = Math.sin((d / 7) * Math.PI) * 5;
      const spike = (d === 15 || d === 40) ? 30 : 0;
      const noise = (Math.random() - 0.5) * 6;
      const y = Math.max(0, Math.round(base + seasonality + spike + noise));
      const promo = spike > 0 ? 1 : 0;
      rows.push(`${sku},${ds},${y},${promo},${categories[si]}`);
    }
  });

  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample_sales_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function CsvInstructions() {
  return (
    <div
      className="rounded-xl p-5 space-y-4 h-fit"
      style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
    >
      <div>
        <p className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>CSV Format</p>
        <p className="text-xs mt-0.5" style={{ color: "#888888" }}>One row per SKU per day</p>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#555555" }}>Required</p>
        {REQUIRED.map(({ col, type, desc, icon: Icon }) => (
          <div key={col} className="flex items-start gap-2.5">
            <div
              className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "rgba(99,102,241,0.12)" }}
            >
              <Icon size={11} style={{ color: "#818CF8" }} />
            </div>
            <div>
              <p className="text-xs">
                <span className="font-mono font-semibold" style={{ color: "#818CF8" }}>{col}</span>
                <span className="ml-1.5 text-xs" style={{ color: "#555555" }}>({type})</span>
              </p>
              <p className="text-xs" style={{ color: "#888888" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#555555" }}>Optional</p>
        {OPTIONAL.map(({ col, type, desc, icon: Icon }) => (
          <div key={col} className="flex items-start gap-2.5">
            <div
              className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "#222222" }}
            >
              <Icon size={11} style={{ color: "#555555" }} />
            </div>
            <div>
              <p className="text-xs">
                <span className="font-mono font-semibold" style={{ color: "#AAAAAA" }}>{col}</span>
                <span className="ml-1.5 text-xs" style={{ color: "#555555" }}>({type})</span>
              </p>
              <p className="text-xs" style={{ color: "#888888" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={generateSampleCsv}
        className="w-full h-8 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
        style={{
          background: "rgba(99,102,241,0.1)",
          color: "#818CF8",
          border: "1px solid rgba(99,102,241,0.2)",
          cursor: "pointer",
        }}
      >
        <Download size={12} /> Download Sample CSV
      </button>
    </div>
  );
}