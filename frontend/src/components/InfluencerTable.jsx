import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Flame } from "lucide-react";
import Badge from "./Badge.jsx";
import { formatCompact, formatChange } from "../services/analytics.js";

export default function InfluencerTable({ influencers }) {
  const navigate = useNavigate();

  return (
    <div className="surface-card overflow-x-auto">
      <table className="w-full text-sm min-w-[820px]">
        <thead>
          <tr className="text-left text-xs text-ink-400 border-b border-ink-100">
            <th className="px-4 py-3 font-medium">Influencer</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Followers</th>
            <th className="px-4 py-3 font-medium">Engagement Rate</th>
            <th className="px-4 py-3 font-medium">Growth</th>
            <th className="px-4 py-3 font-medium">Sentiment</th>
            <th className="px-4 py-3 font-medium">Influence Score</th>
            <th className="px-4 py-3 font-medium">Trending</th>
          </tr>
        </thead>
        <tbody>
          {influencers.map((i) => (
            <tr
              key={i.id}
              className="border-b border-ink-50 last:border-0 hover:bg-ink-50/70 cursor-pointer transition-colors"
              onClick={() => navigate(`/app/influencers/${i.id}`)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-8 w-8 rounded-full bg-gradient-to-br from-signal-400 to-signal2-500 text-white flex items-center justify-center font-semibold text-xs shrink-0">
                    {i.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-ink-900 truncate">{i.name}</p>
                    <p className="text-xs text-ink-400">{i.handle}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-ink-700">{i.category}</td>
              <td className="px-4 py-3 text-ink-700">{formatCompact(i.followers)}</td>
              <td className="px-4 py-3 text-ink-700">{i.engagementRate}%</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 font-medium ${i.followerGrowth >= 0 ? "text-signal2-600" : "text-rose-500"}`}>
                  {i.followerGrowth >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {formatChange(i.followerGrowth)}
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge variant={i.sentiment >= 70 ? "positive" : i.sentiment >= 45 ? "neutral" : "negative"}>
                  {i.sentiment}%
                </Badge>
              </td>
              <td className="px-4 py-3 font-medium text-ink-900">{i.influenceScore}</td>
              <td className="px-4 py-3">
                {i.trending && (
                  <span className="inline-flex items-center gap-1 text-amber-500 text-xs font-semibold">
                    <Flame size={13} /> Trending
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
