import { useMemo, useState } from "react";
import { Target } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import PageHeader from "../components/PageHeader.jsx";
import FilterBar from "../components/FilterBar.jsx";
import TrendCard from "../components/TrendCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import { SkeletonCard, SkeletonChart } from "../components/Skeleton.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { getTrends, getDashboard } from "../services/api.js";
import { formatCompact } from "../services/analytics.js";

const STATUSES = ["Emerging", "Rising", "Stable", "Declining"];

export default function Trends() {
  const { data: trends, loading, error, refetch } = useAsync(getTrends, []);
  const { data: dashboard } = useAsync(getDashboard, []);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    if (!trends) return [];
    return trends.filter((t) => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (status !== "All" && t.status !== status) return false;
      return true;
    });
  }, [trends, search, status]);

  const selected = trends?.find((t) => t.id === selectedId) || filtered[0] || trends?.[0];

  if (loading) {
    return (
      <div>
        <PageHeader title="Trend Detection" subtitle="Track momentum across emerging and established topics." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonChart />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader title="Trend Detection" subtitle="Track momentum across emerging and established topics." />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search topics…"
        filters={[{ key: "status", label: "Status", options: STATUSES }]}
        values={{ status }}
        onChange={(_, value) => setStatus(value)}
        onReset={() => {
          setSearch("");
          setStatus("All");
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No trends match your filters" description="Try a different search or status." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {filtered.map((t) => (
            <TrendCard key={t.id} trend={t} active={selected?.id === t.id} onClick={() => setSelectedId(t.id)} />
          ))}
        </div>
      )}

      {selected && (
        <ChartCard title={`Trend momentum — ${selected.name}`} subtitle="Daily mentions over the tracked period" height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={selected.series} margin={{ left: -20 }}>
              <CartesianGrid stroke="#EEF0F6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#A4A9BD" }} tickFormatter={(d) => d.slice(5)} minTickGap={30} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E4E6EF", fontSize: 12 }} formatter={(v) => [formatCompact(v), "Mentions"]} />
              <Line type="monotone" dataKey="value" stroke="#3A54F5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {dashboard?.opportunities && (
        <div className="surface-card p-5 mt-6">
          <h3 className="font-semibold text-ink-900 text-sm mb-1 flex items-center gap-2">
            <Target size={15} className="text-signal-600" />
            Emerging Opportunities
          </h3>
          <p className="text-xs text-ink-400 mb-4">Confidence-ranked topics worth acting on this week</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {dashboard.opportunities.map((o) => (
              <div key={o.id} className="rounded-lg border border-ink-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-ink-900 text-sm">{o.name}</p>
                  <span className="text-xs font-semibold text-signal2-600">+{o.growth}%</span>
                </div>
                <p className="text-xs text-ink-500 leading-relaxed mb-2">{o.reason}</p>
                <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden mb-1.5">
                  <div className="h-full bg-signal-500" style={{ width: `${o.confidence}%` }} />
                </div>
                <p className="text-[11px] text-ink-400 mb-2">Confidence {o.confidence}%</p>
                <p className="text-xs text-ink-700 bg-signal-50 rounded-md px-2.5 py-1.5">{o.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
