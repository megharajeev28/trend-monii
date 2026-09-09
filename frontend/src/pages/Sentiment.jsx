import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import PageHeader from "../components/PageHeader.jsx";
import ChartCard from "../components/ChartCard.jsx";
import SentimentCard from "../components/SentimentCard.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { SkeletonCard, SkeletonChart } from "../components/Skeleton.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { getSentiment, getCompetitors } from "../services/api.js";

const COLORS = { positive: "#00A891", neutral: "#A4A9BD", negative: "#E12F44" };

export default function Sentiment() {
  const { data, loading, error, refetch } = useAsync(getSentiment, []);
  const { data: competitors } = useAsync(getCompetitors, []);

  const overall = useMemo(() => {
    if (!data) return null;
    const last = data.series[data.series.length - 1];
    return [
      { name: "Positive", value: last.positive, key: "positive" },
      { name: "Neutral", value: last.neutral, key: "neutral" },
      { name: "Negative", value: last.negative, key: "negative" },
    ];
  }, [data]);

  const alerts = useMemo(() => {
    if (!data) return [];
    return data.topics
      .filter((t) => t.negative >= 30)
      .sort((a, b) => b.negative - a.negative)
      .map((t) => ({
        topic: t.topic,
        text: `Negative sentiment around ${t.topic} sits at ${t.negative}% — worth investigating before it compounds.`,
      }));
  }, [data]);

  const competitorSentiment = useMemo(() => {
    if (!competitors) return [];
    return [...competitors]
      .sort((a, b) => b.sentiment - a.sentiment)
      .slice(0, 8)
      .map((c) => ({ name: c.name, sentiment: c.sentiment }));
  }, [competitors]);

  if (loading) {
    return (
      <div>
        <PageHeader title="Sentiment Analysis" subtitle="Understand how audiences feel about topics, competitors, and campaigns." />
        <div className="grid gap-4 lg:grid-cols-2 mb-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader title="Sentiment Analysis" subtitle="Understand how audiences feel about topics, competitors, and campaigns." />

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <ChartCard title="Overall sentiment split" subtitle="Most recent tracked day" height={240}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={overall} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {overall.map((entry) => (
                  <Cell key={entry.key} fill={COLORS[entry.key]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 10, border: "1px solid #E4E6EF", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="lg:col-span-2">
          <ChartCard title="Sentiment over time" subtitle="Positive / neutral / negative share" height={240}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.series} margin={{ left: -20 }}>
                <CartesianGrid stroke="#EEF0F6" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#A4A9BD" }} tickFormatter={(d) => d.slice(5)} minTickGap={30} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E4E6EF", fontSize: 12 }} />
                <Area type="monotone" dataKey="positive" stackId="1" stroke={COLORS.positive} fill={COLORS.positive} fillOpacity={0.75} />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke={COLORS.neutral} fill={COLORS.neutral} fillOpacity={0.55} />
                <Area type="monotone" dataKey="negative" stackId="1" stroke={COLORS.negative} fill={COLORS.negative} fillOpacity={0.75} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <div>
          <h3 className="font-semibold text-ink-900 text-sm mb-3">Topic sentiment</h3>
          <div className="flex flex-col gap-3">
            {data.topics.map((t) => (
              <SentimentCard key={t.topic} topic={t.topic} positive={t.positive} neutral={t.neutral} negative={t.negative} />
            ))}
          </div>
        </div>

        <ChartCard title="Competitor sentiment comparison" height={340}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={competitorSentiment} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid stroke="#EEF0F6" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#A4A9BD" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "#7C8199" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E4E6EF", fontSize: 12 }} formatter={(v) => `${v}%`} />
              <Bar dataKey="sentiment" radius={[0, 4, 4, 0]}>
                {competitorSentiment.map((entry, i) => (
                  <Cell key={i} fill={entry.sentiment >= 60 ? COLORS.positive : entry.sentiment >= 45 ? "#F5A524" : COLORS.negative} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {alerts.length > 0 && (
        <div className="surface-card p-5">
          <h3 className="font-semibold text-ink-900 text-sm mb-3 flex items-center gap-2">
            <AlertTriangle size={15} className="text-rose-500" />
            Sentiment Alerts
          </h3>
          <div className="flex flex-col gap-2.5">
            {alerts.map((a) => (
              <div key={a.topic} className="flex items-start gap-3 rounded-lg bg-rose-400/5 border border-rose-400/20 px-3.5 py-2.5">
                <AlertTriangle size={14} className="text-rose-500 mt-0.5 shrink-0" />
                <p className="text-sm text-ink-700">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
