import { useState } from "react";
import { Tag, Info, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SectionCard from "./SectionCard";

const MAX = 5;

export default function KeywordsSection({ keywords, onChange }) {
  // keywords is string[] stored in parent; raw string in DB is JSON
  const [input, setInput] = useState("");

  const addKeyword = () => {
    const val = input.trim().toLowerCase();
    if (!val || keywords.includes(val) || keywords.length >= MAX) return;
    onChange([...keywords, val]);
    setInput("");
  };

  const removeKeyword = (kw) => onChange(keywords.filter((k) => k !== kw));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <SectionCard icon={Tag} title="Trend Keywords">
      <div className="flex items-center gap-1.5">
        <p className="text-xs" style={{ color: "#888888" }}>Up to {MAX} keywords for Google Trends &amp; TikTok signals</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info size={12} style={{ color: "#555555" }} />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs text-xs">
              These keywords are used for Google Trends and TikTok proxy signals to detect demand spikes.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Tag pills */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", color: "#818CF8" }}
            >
              {kw}
              <button onClick={() => removeKeyword(kw)} style={{ background: "none", border: "none", cursor: "pointer", color: "#818CF8", padding: 0, lineHeight: 1 }}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {keywords.length < MAX && (
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g. "summer dress" then press Enter'
            className="h-9 text-sm flex-1"
            style={{ background: "#222222", border: "1px solid #2A2A2A", color: "#F5F5F5" }}
          />
          <button
            onClick={addKeyword}
            className="h-9 px-3 rounded-lg text-sm font-medium"
            style={{ background: "#2A2A2A", color: "#F5F5F5", border: "none", cursor: "pointer" }}
          >
            Add
          </button>
        </div>
      )}
      {keywords.length >= MAX && (
        <p className="text-xs" style={{ color: "#555555" }}>Maximum of {MAX} keywords reached.</p>
      )}
    </SectionCard>
  );
}