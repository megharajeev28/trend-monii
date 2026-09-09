import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Badge from "./Badge.jsx";
import { formatCompact, formatChange } from "../services/analytics.js";

export default function CompetitorTable({ competitors, onToggleCompare, compareIds = [] }) {
  const navigate = useNavigate();

  return (
    <div className="surface-card overflow-x-auto">
      <table className="w-full text-sm min-w-[760px]">
        <thead>
          <tr className="text-left text-xs text-ink-400 border-b border-ink-100">
            {onToggleCompare && <th className="px-4 py-3 font-medium w-10"></th>}
            <th className="px-4 py-3 font-medium">Competitor</th>
            <th className="px-4 py-3 font-medium">Mentions</th>
            <th className="px-4 py-3 font-medium">Engagement</th>
            <th className="px-4 py-3 font-medium">Sentiment</th>
            <th className="px-4 py-3 font-medium">Posts</th>
            <th className="px-4 py-3 font-medium">Growth</th>
            <th className="px-4 py-3 font-medium">Trend</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((c) => (
            <tr
              key={c.id}
              className="border-b border-ink-50 last:border-0 hover:bg-ink-50/70 cursor-pointer transition-colors"
              onClick={() => navigate(`/app/competitors/${c.id}`)}
            >
              {onToggleCompare && (
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={compareIds.includes(c.id)}
                    onChange={() => onToggleCompare(c.id)}
                    aria-label={`Select ${c.name} for comparison`}
                    className="accent-signal-500"
                  />
                </td>
              )}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-8 w-8 rounded-lg bg-signal-50 text-signal-700 flex items-center justify-center font-semibold text-xs shrink-0">
                    {c.logoInitial}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-ink-900 truncate">{c.name}</p>
                    <p className="text-xs text-ink-400">{c.industry}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-ink-700">{formatCompact(c.mentions)}</td>
              <td className="px-4 py-3 text-ink-700">{formatCompact(c.engagement)}</td>
              <td className="px-4 py-3">
                <Badge variant={c.sentiment >= 70 ? "positive" : c.sentiment >= 45 ? "neutral" : "negative"}>
                  {c.sentiment}%
                </Badge>
              </td>
              <td className="px-4 py-3 text-ink-700">{c.posts}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 font-medium ${c.mentionsGrowth >= 0 ? "text-signal2-600" : "text-rose-500"}`}>
                  {c.mentionsGrowth >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {formatChange(c.mentionsGrowth)}
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge variant={c.trend.toLowerCase()}>{c.trend}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
