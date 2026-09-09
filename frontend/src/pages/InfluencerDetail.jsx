import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2, MapPin, Flame } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Badge from "../components/Badge.jsx";
import ChartCard from "../components/ChartCard.jsx";
import Button from "../components/Button.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { SkeletonCard, SkeletonChart } from "../components/Skeleton.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { getInfluencer, getContent, postSummarize } from "../services/api.js";
import { formatCompact, formatChange } from "../services/analytics.js";

export default function InfluencerDetail() {
  const { id } = useParams();
  const { data: influencer, loading, error, refetch } = useAsync(() => getInfluencer(id), [id]);
  const { data: contentData } = useAsync(getContent, []);
  const [summary, setSummary] = useState(null);
  const [summarizing, setSummarizing] = useState(false);

  async function handleSummarize() {
    setSummarizing(true);
    const result = await postSummarize("influencer", id);
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
  if (!influencer) return <ErrorState message="Influencer not found." />;

  const topPosts = (contentData?.posts || [])
    .filter((p) => p.category === influencer.topContentCategory)
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 5);

  const postPerformance = topPosts.map((p) => ({ name: p.title.slice(0, 18) + "…", score: p.performanceScore }));

  return (
    <div>
      <Link to="/app/influencers" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-4">
        <ArrowLeft size={15} /> Back to Influencers
      </Link>

      <div className="surface-card p-5 mb-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="h-14 w-14 rounded-full bg-gradient-to-br from-signal-400 to-signal2-500 text-white flex items-center justify-center font-display font-semibold text-lg shrink-0">
            {influencer.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-xl font-semibold text-ink-950">{influencer.name}</h1>
              {influencer.trending && (
                <span className="inline-flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  <Flame size={13} /> Trending
                </span>
              )}
            </div>
            <p className="text-sm text-ink-500 mt-0.5 flex items-center gap-2 flex-wrap">
              {influencer.handle} · {influencer.category} · {influencer.platform}
              <span className="inline-flex items-center gap-1 text-ink-400">
                <MapPin size={12} /> {influencer.location}
              </span>
            </p>
          </div>
        </div>
        <Button variant="primary" icon={summarizing ? Loader2 : Sparkles} onClick={handleSummarize} disabled={summarizing}>
          {summarizing ? "Generating…" : "Generate Summary"}
        </Button>
      </div>

      {influencer.bio && <p className="text-sm text-ink-600 mb-5 max-w-2xl leading-relaxed">{influencer.bio}</p>}

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
              <p className="font-medium text-ink-800 mb-1.5">Recommendations</p>
              <ul className="text-ink-500 list-disc list-inside space-y-1">
                {summary.actions.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-5">
        <Stat label="Followers" value={formatCompact(influencer.followers)} change={influencer.followerGrowth} />
        <Stat label="Engagement rate" value={`${influencer.engagementRate}%`} />
        <Stat label="Influence score" value={`${influencer.influenceScore}/100`} />
        <Stat label="Sentiment" value={`${influencer.sentiment}%`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Follower growth" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={influencer.followerSeries} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="infFollowers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3A54F5" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3A54F5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#EEF0F6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#A4A9BD" }} tickFormatter={(d) => d.slice(5)} minTickGap={30} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E4E6EF", fontSize: 12 }} formatter={(v) => [formatCompact(v), "New followers"]} />
              <Area type="monotone" dataKey="value" stroke="#3A54F5" strokeWidth={2} fill="url(#infFollowers)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top content performance" subtitle={`Category: ${influencer.topContentCategory}`} height={260}>
          {postPerformance.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-ink-400">No tracked posts in this category yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postPerformance} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid stroke="#EEF0F6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10, fill: "#7C8199" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E4E6EF", fontSize: 12 }} />
                <Bar dataKey="score" name="Performance score" fill="#00A891" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
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
