import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import CsvDropZone from "../components/upload/CsvDropZone";
import CsvInstructions from "../components/upload/CsvInstructions";
import ValidationReport from "../components/upload/ValidationReport";
import { Crown, Zap, Loader2, AlertCircle } from "lucide-react";

const REQUIRED_COLS = ["unique_id", "ds", "y"];
const OPTIONAL_COLS = ["promo_flag", "category"];
const FREE_SKU_LIMIT = 20;

function parseCSV(text) {
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase());
  const rows = lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
    return obj;
  });
  return { headers, rows };
}

function validateCSV(headers, rows) {
  // Column checks
  const missingRequired = REQUIRED_COLS.filter((c) => !headers.includes(c));
  const missingOptional = OPTIONAL_COLS.filter((c) => !headers.includes(c));

  if (missingRequired.length > 0) {
    return {
      error: `Missing required columns: ${missingRequired.join(", ")}`,
      warnings: [],
      report: null,
      skuCount: 0,
    };
  }

  const warnings = missingOptional.length > 0
    ? [`Optional columns absent: ${missingOptional.join(", ")} — forecast accuracy may be lower`]
    : [];

  // Group by SKU
  const skuMap = {};
  rows.forEach((row) => {
    const sku = row["unique_id"];
    if (!sku) return;
    if (!skuMap[sku]) skuMap[sku] = [];
    skuMap[sku].push(row);
  });

  const valid = [];
  const degraded = [];
  const rejected = [];

  Object.entries(skuMap).forEach(([sku, skuRows]) => {
    const validRows = skuRows.filter((r) => {
      const y = parseFloat(r["y"]);
      return r["ds"] && /^\d{4}-\d{2}-\d{2}$/.test(r["ds"]) && !isNaN(y) && y >= 0;
    });
    const missingCount = skuRows.length - validRows.length;
    const missingPct = skuRows.length > 0 ? missingCount / skuRows.length : 0;

    const dates = validRows.map((r) => r["ds"]).sort();
    const dateRange = dates.length > 0 ? { from: dates[0], to: dates[dates.length - 1] } : null;

    if (validRows.length === 0) {
      rejected.push({ sku, rows: skuRows.length, reason: "No valid rows found" });
    } else if (missingPct > 0.5) {
      degraded.push({ sku, rows: skuRows.length, reason: `More than 50% missing or invalid values (${Math.round(missingPct * 100)}%)` });
    } else if (validRows.length < 30) {
      degraded.push({ sku, rows: validRows.length, dateRange, reason: `Less than 30 days of data (${validRows.length} days)` });
    } else {
      valid.push({ sku, rows: validRows.length, dateRange });
    }
  });

  return {
    error: null,
    warnings,
    report: { valid, degraded, rejected },
    skuCount: Object.keys(skuMap).length,
  };
}

export default function Upload() {
  const [file, setFile] = useState(null);
  const [csvError, setCsvError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [report, setReport] = useState(null);
  const [skuCount, setSkuCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [plan, setPlan] = useState("free");
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      const settings = await base44.entities.UserSettings.filter({ user_id: u.id });
      if (settings[0]?.plan) setPlan(settings[0].plan);
    }).catch(() => {});
  }, []);

  const handleFile = async (f) => {
    setFile(f);
    setCsvError(null);
    setReport(null);
    setWarnings([]);
    setSkuCount(0);

    if (!f) return;

    // Read + validate client-side
    const text = await f.text();
    const { headers, rows } = parseCSV(text);
    const result = validateCSV(headers, rows);

    setCsvError(result.error);
    setWarnings(result.warnings);
    setReport(result.report);
    setSkuCount(result.skuCount);
  };

  const handleRunForecast = async () => {
    if (!file || csvError) return;
    setSubmitting(true);

    // Simulate upload progress
    setUploading(true);
    for (let p = 10; p <= 90; p += 20) {
      setUploadProgress(p);
      await new Promise((r) => setTimeout(r, 200));
    }
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUploadProgress(100);
    setUploading(false);

    const user = await base44.auth.me();
    const job = await base44.entities.ForecastJob.create({
      user_id: user.id,
      status: "pending",
      file_name: file.name,
      sku_count: skuCount,
    });

    navigate(createPageUrl(`Results?jobId=${job.id}`));
  };

  const isFreeLimitExceeded = plan === "free" && skuCount > FREE_SKU_LIMIT;
  const canRun = file && !csvError && report && !isFreeLimitExceeded && report.valid.length > 0;

  return (
    <div className="min-h-screen p-6 md:p-8 animate-fade-in" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div className="mb-7">
        <h1 className="text-xl font-semibold" style={{ color: "#F5F5F5" }}>New Forecast</h1>
        <p className="text-sm mt-0.5" style={{ color: "#888888" }}>
          Upload your sales history CSV to generate a D+1–D+14 forecast.
        </p>
      </div>

      {/* Free plan banner */}
      {plan === "free" && (
        <div
          className="rounded-xl p-3.5 flex items-center gap-3 mb-6"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <Crown size={14} style={{ color: "#818CF8", flexShrink: 0 }} />
          <p className="text-xs" style={{ color: "#AAAAAA" }}>
            <span className="font-semibold" style={{ color: "#818CF8" }}>Free plan:</span> limited to {FREE_SKU_LIMIT} SKUs.{" "}
            <span style={{ color: "#6366F1", cursor: "pointer" }}>Upgrade for unlimited →</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: drop zone + validation */}
        <div className="lg:col-span-2 space-y-5">
          <CsvDropZone
            onFile={handleFile}
            uploading={uploading}
            uploadProgress={uploadProgress}
          />

          {/* Column error */}
          {csvError && (
            <div
              className="rounded-lg p-3.5 flex items-start gap-2.5"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <AlertCircle size={14} style={{ color: "#EF4444", flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs" style={{ color: "#EF4444" }}>{csvError}</p>
            </div>
          )}

          {/* Free limit exceeded */}
          {isFreeLimitExceeded && (
            <div
              className="rounded-lg p-3.5 flex items-start gap-2.5"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <AlertCircle size={14} style={{ color: "#EF4444", flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs" style={{ color: "#EF4444" }}>
                Your CSV contains <strong>{skuCount} SKUs</strong>, exceeding the free plan limit of {FREE_SKU_LIMIT}.{" "}
                <span style={{ color: "#818CF8", cursor: "pointer" }}>Upgrade to Pro</span> to process all SKUs.
              </p>
            </div>
          )}

          {/* Validation report */}
          {report && !csvError && (
            <ValidationReport report={report} warnings={warnings} />
          )}

          {/* Run Forecast button */}
          {report && !csvError && (
            <button
              onClick={handleRunForecast}
              disabled={!canRun || submitting}
              className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all mt-2"
              style={{
                background: !canRun || submitting ? "#222222" : "#6366F1",
                color: !canRun || submitting ? "#555555" : "#fff",
                border: "none",
                cursor: !canRun || submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? (
                <><Loader2 size={14} className="animate-spin" /> Creating job…</>
              ) : (
                <><Zap size={14} /> Run Forecast ({report.valid.length} valid SKU{report.valid.length !== 1 ? "s" : ""})</>
              )}
            </button>
          )}
        </div>

        {/* Right: instructions */}
        <div className="lg:col-span-1">
          <CsvInstructions />
        </div>
      </div>
    </div>
  );
}