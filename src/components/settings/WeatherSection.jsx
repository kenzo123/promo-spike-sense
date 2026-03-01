import { MapPin, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SectionCard from "./SectionCard";

export default function WeatherSection({ lat, lon, onChange }) {
  return (
    <SectionCard icon={MapPin} title="Weather Location">
      <div className="flex items-center gap-1.5 mb-3">
        <p className="text-xs" style={{ color: "#888888" }}>Weather location for forecasting context</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info size={12} style={{ color: "#555555" }} />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs text-xs">
              We use local weather data as a demand signal to improve forecast accuracy.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: "#888888" }}>Latitude</label>
          <Input
            type="number"
            value={lat}
            onChange={(e) => onChange("weather_lat", parseFloat(e.target.value))}
            step="0.01"
            className="h-9 text-sm"
            style={{ background: "#222222", border: "1px solid #2A2A2A", color: "#F5F5F5" }}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: "#888888" }}>Longitude</label>
          <Input
            type="number"
            value={lon}
            onChange={(e) => onChange("weather_lon", parseFloat(e.target.value))}
            step="0.01"
            className="h-9 text-sm"
            style={{ background: "#222222", border: "1px solid #2A2A2A", color: "#F5F5F5" }}
          />
        </div>
      </div>
      <p className="text-xs mt-2" style={{ color: "#555555" }}>Default: Paris (48.85, 2.35)</p>
    </SectionCard>
  );
}