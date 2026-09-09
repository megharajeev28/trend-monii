import { useMemo, useState } from "react";
import { Scale } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import FilterBar from "../components/FilterBar.jsx";
import CompetitorTable from "../components/CompetitorTable.jsx";
import Modal from "../components/Modal.jsx";
import Button from "../components/Button.jsx";
import { SkeletonTable } from "../components/Skeleton.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { getCompetitors } from "../services/api.js";
import { compareCompetitors, formatCompact } from "../services/analytics.js";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const PLATFORMS = ["X", "LinkedIn", "Instagram", "YouTube", "TikTok"];
const TRENDS = ["Emerging", "Rising", "Stable", "Declining"];

export default function Competitors() {
  const { data: competitors, loading, error, refetch } = useAsync(getCompetitors, []);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ platform: "All", trend: "All" });
  const [compareIds, setCompareIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!competitors) return [];
    return competitors.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.platform !== "All" && c.platform !== filters.platform) return false;
      if (filters.trend !== "All" && c.trend !== filters.trend) return false;
      return true;
    });
  }, [competitors, search, filters]);

  function toggleCompare(id) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  const compareList = (competitors || []).filter((c) => compareIds.includes(c.id));

  if (loading) {
    return (
      <div>
        <PageHeader title="Competitor Intelligence" subtitle="Monitor posting activity, engagement, and sentiment across competitors." />
        <SkeletonTable rows={8} cols={7} />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Competitor Intelligence"
        subtitle="Monitor posting activity, engagement, and sentiment across competitors."
        actions={
          <Button variant="secondary" icon={Scale} onClick={() => setCompareOpen(true)} disabled={compareIds.length < 2}>
            Compare {compareIds.length > 0 && `(${compareIds.length})`}
          </Button>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search competitors…"
        filters={[
          { key: "platform", label: "Platform", options: PLATFORMS },
          { key: "trend", label: "Trend", options: TRENDS },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        onReset={() => {
          setSearch("");
          setFilters({ platform: "All", trend: "All" });
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No competitors match your filters" description="Try clearing filters or searching a different name." />
      ) : (
        <CompetitorTable competitors={filtered} onToggleCompare={toggleCompare} compareIds={compareIds} />
      )}

      <Modal open={compareOpen} onClose={() => setCompareOpen(false)} title="Competitor Comparison" width="max-w-3xl">
        {compareList.length < 2 ? (
          <p className="text-sm text-ink-500">Select at least two competitors from the table to compare.</p>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="rounded-lg bg-signal-50 border border-signal-100 p-4 text-sm text-ink-700 leading-relaxed">
              {compareCompetitors(compareList)}
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compareList} margin={{ left: -20 }}>
                  <CartesianGrid stroke="#EEF0F6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E4E6EF", fontSize: 12 }} formatter={(v) => formatCompact(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="mentions" name="Mentions" fill="#3A54F5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="engagement" name="Engagement" fill="#00A891" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {compareList.map((c) => (
                <div key={c.id} className="rounded-lg border border-ink-100 p-3">
                  <p className="font-medium text-sm text-ink-900 mb-2">{c.name}</p>
                  <dl className="text-xs text-ink-500 flex flex-col gap-1">
                    <div className="flex justify-between"><dt>Sentiment</dt><dd className="text-ink-800 font-medium">{c.sentiment}%</dd></div>
                    <div className="flex justify-between"><dt>Posting freq.</dt><dd className="text-ink-800 font-medium">{c.postingFrequencyPerWeek}/wk</dd></div>
                    <div className="flex justify-between"><dt>Follower growth</dt><dd className="text-ink-800 font-medium">{c.followerGrowth}%</dd></div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
