import { useState } from "react";
import { FileText, Users, TrendingUp, SmilePlus, Download, FileJson } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import Button from "../components/Button.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { SkeletonCard } from "../components/Skeleton.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useToast } from "../hooks/useToast.js";
import { getCompetitors, getInfluencers, getTrends, getSentiment, getDashboard } from "../services/api.js";
import {
  buildWeeklyCompetitiveReport,
  buildInfluencerReport,
  buildTrendReport,
  buildSentimentReport,
} from "../utils/reportBuilder.js";
import { buildCsv, downloadFile } from "../services/analytics.js";

const REPORT_TYPES = [
  { key: "competitive", label: "Weekly Competitive Report", icon: FileText },
  { key: "influencer", label: "Influencer Report", icon: Users },
  { key: "trend", label: "Trend Report", icon: TrendingUp },
  { key: "sentiment", label: "Sentiment Report", icon: SmilePlus },
];

export default function Reports() {
  const [selected, setSelected] = useState("competitive");
  const [report, setReport] = useState(null);
  const toast = useToast();

  const { data: competitors, loading: l1, error: e1 } = useAsync(getCompetitors, []);
  const { data: influencers, loading: l2, error: e2 } = useAsync(getInfluencers, []);
  const { data: trends, loading: l3, error: e3 } = useAsync(getTrends, []);
  const { data: sentiment, loading: l4, error: e4 } = useAsync(getSentiment, []);
  const { data: dashboard, loading: l5, error: e5 } = useAsync(getDashboard, []);

  const loading = l1 || l2 || l3 || l4 || l5;
  const error = e1 || e2 || e3 || e4 || e5;

  function generate() {
    if (selected === "competitive") setReport(buildWeeklyCompetitiveReport({ competitors, dashboard }));
    if (selected === "influencer") setReport(buildInfluencerReport({ influencers }));
    if (selected === "trend") setReport(buildTrendReport({ trends }));
    if (selected === "sentiment") setReport(buildSentimentReport({ sentimentTopics: sentiment.topics }));
    toast.success("Report generated");
  }

  function exportCsv() {
    if (!report) return;
    downloadFile(`${slug(report.title)}.csv`, buildCsv(report.rows, report.columns), "text/csv");
    toast.success("CSV exported");
  }

  function exportJson() {
    if (!report) return;
    downloadFile(`${slug(report.title)}.json`, JSON.stringify(report, null, 2), "application/json");
    toast.success("JSON exported");
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Reports" subtitle="Generate a shareable report from your tracked data." />
        <SkeletonCard />
      </div>
    );
  }
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Reports" subtitle="Generate a shareable report from your tracked data." />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {REPORT_TYPES.map((r) => (
          <button
            key={r.key}
            onClick={() => {
              setSelected(r.key);
              setReport(null);
            }}
            className={`surface-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-popover ${
              selected === r.key ? "ring-2 ring-signal-400 ring-offset-2 ring-offset-ink-50" : ""
            }`}
          >
            <span className="h-9 w-9 rounded-lg bg-signal-50 text-signal-600 flex items-center justify-center mb-3">
              <r.icon size={16} />
            </span>
            <p className="text-sm font-medium text-ink-900">{r.label}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2.5 mb-6">
        <Button variant="primary" onClick={generate}>
          Generate Report
        </Button>
        <Button variant="secondary" icon={Download} onClick={exportCsv} disabled={!report}>
          Export CSV
        </Button>
        <Button variant="secondary" icon={FileJson} onClick={exportJson} disabled={!report}>
          Export JSON
        </Button>
      </div>

      {report ? (
        <div className="surface-card p-5">
          <h3 className="font-semibold text-ink-900 mb-2">{report.title}</h3>
          <p className="text-sm text-ink-600 leading-relaxed mb-5 bg-signal-50 rounded-lg p-3.5">{report.summary}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left text-xs text-ink-400 border-b border-ink-100">
                  {report.columns.map((c) => (
                    <th key={c.key} className="px-4 py-2.5 font-medium">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row, i) => (
                  <tr key={i} className="border-b border-ink-50 last:border-0">
                    {report.columns.map((c) => (
                      <td key={c.key} className="px-4 py-2.5 text-ink-700">
                        {row[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="surface-card p-10 text-center text-sm text-ink-400">
          Select a report type above and click "Generate Report" to see a preview.
        </div>
      )}
    </div>
  );
}

function slug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
