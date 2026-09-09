import { useMemo } from "react";
import {
  MessagesSquare,
  Heart,
  Smile,
  Flame,
  Users,
  Swords,
  ArrowRight,
  Target,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import PageHeader from "../components/PageHeader.jsx";
import MetricCard from "../components/MetricCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import InsightCard from "../components/InsightCard.jsx";
import { SkeletonCard, SkeletonChart } from "../components/Skeleton.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useAppContext } from "../hooks/useAppContext.js";
import { getDashboard } from "../services/api.js";
import { formatCompact } from "../services/analytics.js";
import { Link } from "react-router-dom";

const PIPELINE_STEPS = [
  "Raw Social Posts",
  "Data Cleaning",
  "Text Preprocessing",
  "Sentiment Analysis",
  "Keyword Extraction",
  "Topic Detection",
  "Trend Scoring",
  "AI Summary",
];

export default function Overview() {
  const { data, loading, error, refetch } = useAsync(getDashboard, []);
  const { dateRangeMeta } = useAppContext();

  const scaled = useMemo(() => {
    if (!data) return null;
    const scale = dateRangeMeta.scale;
    const scaleKpi = (k) => ({ value: Math.round(k.value * scale), change: k.change });
    return {
      kpis: {
        totalMentions: scaleKpi(data.kpis.totalMentions),
        engagement: scaleKpi(data.kpis.engagement),
        sentimentScore: data.kpis.sentimentScore,
        trendingTopics: data.kpis.trendingTopics,
        influencersTracked: data.kpis.influencersTracked,
        competitorsTracked: data.kpis.competitorsTracked,
      },
      mentionsOverTime: data.mentionsOverTime,
    };
  }, [data, dateRangeMeta]);

  if (loading) {
    return (
      <div>
        <PageHeader title="Good morning, Megha 👋" subtitle="Here's what changed across your competitive landscape." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonChart />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const k = scaled.kpis;

  return (
    <div>
      <PageHeader
        title="Good morning, Megha 👋"
        subtitle="Here's what changed across your competitive landscape."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
        <MetricCard
          label="Total Mentions"
          value={formatCompact(k.totalMentions.value)}
          change={k.totalMentions.change}
          icon={MessagesSquare}
          accent="signal"
          spark={scaled.mentionsOverTime.map((d) => ({ value: d.mentions }))}
        />
        <MetricCard label="Engagement" value={formatCompact(k.engagement.value)} change={k.engagement.change} icon={Heart} accent="rose" />
        <MetricCard label="Sentiment Score" value={`${k.sentimentScore.value}%`} change={k.sentimentScore.change} icon={Smile} accent="signal2" />
        <MetricCard label="Trending Topics" value={k.trendingTopics.value} change={k.trendingTopics.change} icon={Flame} accent="amber" />
        <MetricCard label="Influencers Tracked" value={k.influencersTracked.value} change={k.influencersTracked.change} icon={Users} accent="signal" />
        <MetricCard label="Competitors Tracked" value={k.competitorsTracked.value} change={k.competitorsTracked.change} icon={Swords} accent="signal2" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <ChartCard title="Mentions over time" subtitle={dateRangeMeta.label} height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scaled.mentionsOverTime} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="mentionsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3A54F5" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3A54F5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#EEF0F6" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#A4A9BD" }} tickFormatter={(d) => d.slice(5)} minTickGap={30} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #E4E6EF", fontSize: 12 }}
                  formatter={(v) => [formatCompact(v), "Mentions"]}
                  labelFormatter={(l) => l}
                />
                <Area type="monotone" dataKey="mentions" stroke="#3A54F5" strokeWidth={2} fill="url(#mentionsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="surface-card p-5 flex flex-col">
          <h3 className="font-semibold text-ink-900 text-sm mb-1 flex items-center gap-2">
            <Target size={15} className="text-signal-600" />
            Emerging Opportunities
          </h3>
          <p className="text-xs text-ink-400 mb-3">Confidence-ranked, action-ready</p>
          <div className="flex flex-col gap-3 flex-1">
            {data.opportunities.map((o) => (
              <div key={o.id} className="rounded-lg border border-ink-100 p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-ink-900">{o.name}</p>
                  <span className="text-xs font-semibold text-signal2-600">+{o.growth}%</span>
                </div>
                <p className="text-xs text-ink-500 leading-relaxed">{o.reason}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-ink-400">Confidence {o.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/app/trends" className="text-xs font-medium text-signal-600 hover:text-signal-700 flex items-center gap-1 mt-3">
            View all trends <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <div className="surface-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-ink-900 text-sm flex items-center gap-2">
            <Flame size={15} className="text-signal-600" />
            AI-Powered Insights
          </h3>
          <span className="text-xs text-ink-400">Updated moments ago</span>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {data.insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      <div className="surface-card p-5">
        <h3 className="font-semibold text-ink-900 text-sm mb-4">How this data gets processed</h3>
        <div className="flex flex-wrap items-center gap-2">
          {PIPELINE_STEPS.map((step, idx) => (
            <div key={step} className="flex items-center gap-2">
              <span className="text-xs font-medium text-ink-600 bg-ink-50 border border-ink-100 rounded-full px-3 py-1.5 whitespace-nowrap">
                {step}
              </span>
              {idx < PIPELINE_STEPS.length - 1 && <ArrowRight size={12} className="text-ink-300 shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
