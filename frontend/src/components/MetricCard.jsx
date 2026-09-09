import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

const ACCENTS = {
  signal: "bg-signal-50 text-signal-600",
  signal2: "bg-signal2-400/10 text-signal2-600",
  amber: "bg-amber-400/10 text-amber-500",
  rose: "bg-rose-400/10 text-rose-500",
};

export default function MetricCard({ label, value, change, spark, icon: Icon, accent = "signal" }) {
  const positive = change >= 0;
  const gradId = `spark-${String(label).replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div className="surface-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500 font-medium">{label}</p>
        {Icon && (
          <span className={`h-8 w-8 rounded-lg flex items-center justify-center ${ACCENTS[accent] || ACCENTS.signal}`}>
            <Icon size={15} />
          </span>
        )}
      </div>
      <p className="font-display text-2xl font-semibold text-ink-950 tracking-tight">{value}</p>
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold ${
            positive ? "text-signal2-600" : "text-rose-500"
          }`}
        >
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {positive ? "+" : ""}
          {change}% vs previous period
        </span>
      </div>
      {spark && spark.length > 1 && (
        <div className="h-8 -mx-1 -mb-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark}>
              <defs>
                <linearGradient id={`${gradId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3A54F5" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3A54F5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3A54F5"
                strokeWidth={1.75}
                fill={`url(#${gradId})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
