import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Badge from "../components/Badge.jsx";
import ChartCard from "../components/ChartCard.jsx";
import Button from "../components/Button.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { SkeletonCard, SkeletonChart } from "../components/Skeleton.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { getCompetitor, getContent, postSummarize } from "../services/api.js";
import { formatCompact, formatChange } from "../services/analytics.js";

export default function CompetitorDetail() {
  const { id } = useParams();
  const { data: competitor, loading, error, refetch } = useAsync(() => getCompetitor(id), [id]);
  const { data: contentData } = useAsync(getContent, []);
  const [summary, setSummary] = useState(null);
  const [summarizing, setSummarizing] = useState(false);

  async function handleSummarize() {
    setSummarizing(true);
    const result = await postSummarize("competitor", id);
    setSummary(result);
    setSummarizing(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <SkeletonCard />
        <SkeletonChart />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!competitor) return <ErrorState message="Competitor not found." />;

  const relatedPosts = (contentData?.posts || []).filter((p) => competitor.topTopics.includes(p.topic)).slice(0, 5);

  return (
    <div>
      <Link to="/app/competitors" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-4">
        <ArrowLeft size={15} /> Back to Competitors
      </Link>

      <div className="surface-card p-5 mb-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="h-14 w-14 rounded-xl bg-signal-50 text-signal-700 flex items-center justify-center font-display font-semibold text-xl shrink-0">
            {competitor.logoInitial}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-xl font-semibold text-ink-950">{competitor.name}</h1>
              <Badge variant={competitor.trend.toLowerCase()}>{competitor.trend}</Badge>
            </div>
            <p className="text-sm text-ink-500 mt-0.5">
              {competitor.industry} · Primary platform: {competitor.platform}
            </p>
          </div>
        </div>
        <Button variant="primary" icon={summarizing ? Loader2 : Sparkles} onClick={handleSummarize} disabled={summarizing}>
          {summarizing ? "Generating…" : "Generate Summary"}
        </Button>
      </div>

      {summary && (
        <div className="surface-card p-5 mb-5 border-l-[3px] border-signal-500">
          <h3 className="font-semibold text-ink-900 text-sm mb-3 flex items-center gap-2">
            <Sparkles size={15} className="text-signal-600" /> AI Summary
          </h3>
          <p className="text-sm text-ink-700 leading-relaxed mb-4">{summary.executiveSummary}</p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-ink-800 mb-1.5">Key Trends</p>
              <ul className="text-ink-500 list-disc list-inside space-y-1">
                {summary.keyTrends.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-medium text-ink-800 mb-1.5">Recent Changes</p>
              <ul className="text-ink-500 list-disc list-inside space-y-1">
                {summary.changes.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-medium text-ink-800 mb-1.5">Recommended Actions</p>
              <ul className="text-ink-500 list-disc list-inside space-y-1">
                {summary.actions.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-5">
        <Stat label="Mentions" value={formatCompact(competitor.mentions)} change={competitor.mentionsGrowth} />
        <Stat label="Engagement" value={formatCompact(competitor.engagement)} change={competitor.engagementGrowth} />
        <Stat label="Posting frequency" value={`${competitor.postingFrequencyPerWeek}/wk`} />
        <Stat label="Follower growth" value={`${competitor.followerCount.toLocaleString()}`} change={competitor.followerGrowth} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <ChartCard title="Mentions over time" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={competitor.mentionsSeries} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="compMentions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3A54F5" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3A54F5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#EEF0F6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#A4A9BD" }} tickFormatter={(d) => d.slice(5)} minTickGap={30} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E4E6EF", fontSize: 12 }} />
              <Area type="monotone" dataKey="value" name="Mentions" stroke="#3A54F5" strokeWidth={2} fill="url(#compMentions)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Engagement over time" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={competitor.engagementSeries} margin={{ left: -20 }}>
              <CartesianGrid stroke="#EEF0F6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#A4A9BD" }} tickFormatter={(d) => d.slice(5)} minTickGap={30} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E4E6EF", fontSize: 12 }} />
              <Line type="monotone" dataKey="value" name="Engagement" stroke="#00A891" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Sentiment over time" height={220}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={competitor.sentimentSeries} margin={{ left: -20 }}>
              <CartesianGrid stroke="#EEF0F6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#A4A9BD" }} tickFormatter={(d) => d.slice(5)} minTickGap={30} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E4E6EF", fontSize: 12 }} />
              <Line type="monotone" dataKey="value" name="Sentiment" stroke="#F5A524" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="surface-card p-5">
          <h3 className="font-semibold text-ink-900 text-sm mb-3">Top topics &amp; recent activity</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {competitor.topTopics.map((t) => (
              <span key={t} className="text-xs bg-ink-50 border border-ink-100 rounded-full px-2.5 py-1 text-ink-600">
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide mb-2">Related content</p>
          <ul className="flex flex-col gap-2.5">
            {relatedPosts.length === 0 && <li className="text-sm text-ink-400">No related posts tracked.</li>}
            {relatedPosts.map((p) => (
              <li key={p.id} className="text-sm text-ink-700 border-b border-ink-50 pb-2 last:border-0">
                <p className="font-medium text-ink-900 truncate">{p.title}</p>
                <p className="text-xs text-ink-400">{p.platform} · {formatCompact(p.engagement)} engagement</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, change }) {
  return (
    <div className="surface-card p-4">
      <p className="text-xs text-ink-400 mb-1">{label}</p>
      <p className="font-display text-lg font-semibold text-ink-950">{value}</p>
      {change !== undefined && (
        <p className={`text-xs font-medium mt-0.5 ${change >= 0 ? "text-signal2-600" : "text-rose-500"}`}>{formatChange(change)}</p>
      )}
    </div>
  );
}
