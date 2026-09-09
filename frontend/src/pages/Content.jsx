import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import PageHeader from "../components/PageHeader.jsx";
import FilterBar from "../components/FilterBar.jsx";
import ChartCard from "../components/ChartCard.jsx";
import Badge from "../components/Badge.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { SkeletonTable, SkeletonChart } from "../components/Skeleton.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { getContent } from "../services/api.js";
import { formatCompact } from "../services/analytics.js";

const PLATFORMS = ["X", "LinkedIn", "Instagram", "YouTube", "TikTok"];
const CATEGORIES = ["Educational", "Tutorial", "Product Launch", "Opinion", "Promotional"];
const CATEGORY_COLORS = ["#3A54F5", "#00A891", "#6577FF", "#F5A524", "#E12F44"];

export default function Content() {
  const { data, loading, error, refetch } = useAsync(getContent, []);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ platform: "All", category: "All" });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.posts
      .filter((p) => {
        if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.author.toLowerCase().includes(search.toLowerCase())) return false;
        if (filters.platform !== "All" && p.platform !== filters.platform) return false;
        if (filters.category !== "All" && p.category !== filters.category) return false;
        return true;
      })
      .sort((a, b) => b.performanceScore - a.performanceScore);
  }, [data, search, filters]);

  const recommendation = useMemo(() => {
    if (!data) return null;
    const sorted = [...data.categoryEngagement].sort((a, b) => b.engagement - a.engagement);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    const diff = Math.round(((best.engagement - worst.engagement) / worst.engagement) * 100);
    return `${best.category} content currently outperforms ${worst.category.toLowerCase()} content by ${diff}%.`;
  }, [data]);

  if (loading) {
    return (
      <div>
        <PageHeader title="Content Intelligence" subtitle="See which formats and categories actually drive engagement." />
        <SkeletonChart />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader title="Content Intelligence" subtitle="See which formats and categories actually drive engagement." />

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <ChartCard title="Engagement by content category" height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categoryEngagement} margin={{ left: -20 }}>
                <CartesianGrid stroke="#EEF0F6" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E4E6EF", fontSize: 12 }} formatter={(v) => formatCompact(v)} />
                <Bar dataKey="engagement" radius={[6, 6, 0, 0]}>
                  {data.categoryEngagement.map((_, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="surface-card p-5 flex flex-col">
          <h3 className="font-semibold text-ink-900 text-sm mb-3 flex items-center gap-2">
            <Sparkles size={15} className="text-signal-600" />
            AI Recommendation
          </h3>
          <p className="text-sm text-ink-700 leading-relaxed bg-signal-50 rounded-lg p-3.5 flex-1">{recommendation}</p>
          <div className="mt-4 flex flex-col gap-2">
            {data.categoryEngagement.map((c) => (
              <div key={c.category} className="flex items-center justify-between text-xs text-ink-500">
                <span>{c.category}</span>
                <span className="text-ink-800 font-medium">Avg sentiment {c.avgSentiment}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search content or authors…"
        filters={[
          { key: "platform", label: "Platform", options: PLATFORMS },
          { key: "category", label: "Category", options: CATEGORIES },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        onReset={() => {
          setSearch("");
          setFilters({ platform: "All", category: "All" });
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No content matches your filters" description="Try clearing filters or searching a different term." />
      ) : (
        <div className="surface-card overflow-x-auto">
          <table className="w-full text-sm min-w-[840px]">
            <thead>
              <tr className="text-left text-xs text-ink-400 border-b border-ink-100">
                <th className="px-4 py-3 font-medium">Content</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium">Topic</th>
                <th className="px-4 py-3 font-medium">Engagement</th>
                <th className="px-4 py-3 font-medium">Sentiment</th>
                <th className="px-4 py-3 font-medium">Performance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 25).map((p) => (
                <tr key={p.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/70">
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-medium text-ink-900 truncate">{p.title}</p>
                    <p className="text-xs text-ink-400">{p.category}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{p.author}</td>
                  <td className="px-4 py-3 text-ink-700">{p.platform}</td>
                  <td className="px-4 py-3 text-ink-700">{p.topic}</td>
                  <td className="px-4 py-3 text-ink-700">{formatCompact(p.engagement)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.sentimentScore >= 70 ? "positive" : p.sentimentScore >= 45 ? "neutral" : "negative"}>
                      {p.sentimentScore}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink-900">{p.performanceScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
