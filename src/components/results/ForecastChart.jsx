import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs space-y-1"
      style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#F5F5F5" }}
    >
      <p className="font-medium" style={{ color: "#888888" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function ForecastChart({ data, todayIndex = 7 }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="w-full h-52">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
          <XAxis dataKey="day" tick={{ fill: "#555555", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#555555", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            x={data[todayIndex]?.day}
            stroke="#2A2A2A"
            strokeDasharray="4 4"
            label={{ value: "Today", fill: "#555555", fontSize: 9 }}
          />
          <Area
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke="#6366F1"
            strokeWidth={2}
            fill="url(#gradActual)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="forecast"
            name="Forecast"
            stroke="#22C55E"
            strokeWidth={2}
            fill="url(#gradForecast)"
            strokeDasharray="5 3"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}