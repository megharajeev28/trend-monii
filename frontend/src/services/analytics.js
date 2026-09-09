// Client-side analytics helpers.
//
// These functions turn raw metrics into the kind of narrative sentences the product
// promises ("Competitor X increased posting frequency by 34%...") instead of raw numbers.
// They are deterministic (no randomness) so the same input always produces the same
// summary — mirroring how backend/app/services/nlp_service.py behaves.

export function formatCompact(num) {
  if (num === null || num === undefined) return "—";
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return `${num}`;
}

export function formatChange(change) {
  if (change === null || change === undefined) return "";
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

export function sentimentLabel(score) {
  if (score >= 70) return "Positive";
  if (score >= 45) return "Neutral";
  return "Negative";
}

export function statusColor(status) {
  switch (status) {
    case "Emerging":
      return "text-signal-600 bg-signal-50";
    case "Rising":
      return "text-signal2-600 bg-signal2-400/10";
    case "Declining":
      return "text-rose-500 bg-rose-400/10";
    default:
      return "text-ink-500 bg-ink-100";
  }
}

export function impactBadgeClass(impact) {
  if (impact === "High") return "badge-high";
  if (impact === "Medium") return "badge-medium";
  return "badge-low";
}

/**
 * Compare 2–3 competitors and produce an AI-style written conclusion.
 * Mirrors nlp_service.generate_summary on the backend.
 */
export function compareCompetitors(list) {
  if (!list || list.length < 2) return "Select at least two competitors to compare.";

  const byEngagement = [...list].sort((a, b) => b.engagement - a.engagement);
  const bySentiment = [...list].sort((a, b) => b.sentiment - a.sentiment);
  const byGrowth = [...list].sort((a, b) => b.mentionsGrowth - a.mentionsGrowth);

  const leader = byEngagement[0];
  const sentimentLeader = bySentiment[0];
  const growthLeader = byGrowth[0];

  const sentences = [];
  sentences.push(`${leader.name} leads in engagement with ${formatCompact(leader.engagement)} interactions tracked.`);

  if (sentimentLeader.id !== leader.id) {
    sentences.push(`${sentimentLeader.name} holds the strongest positive sentiment at ${sentimentLeader.sentiment}%.`);
  }

  if (growthLeader.mentionsGrowth > 20 && growthLeader.id !== leader.id) {
    sentences.push(`${growthLeader.name} is growing fastest at ${formatChange(growthLeader.mentionsGrowth)} and may represent an emerging competitive threat.`);
  } else if (growthLeader.mentionsGrowth > 20) {
    sentences.push(`${growthLeader.name} is also growing fastest at ${formatChange(growthLeader.mentionsGrowth)}, reinforcing its lead.`);
  }

  return sentences.join(" ");
}

/**
 * Deterministic mock "AI summarization" used when no external LLM is configured.
 * Structured the same way a real completion would be, so swapping in a live model
 * later requires no changes to the UI.
 */
export function generateSummary(entityType, entity) {
  if (!entity) {
    return {
      executiveSummary: "No data available for this entity.",
      keyTrends: [],
      topTopics: [],
      sentiment: null,
      changes: [],
      actions: [],
    };
  }

  if (entityType === "competitor") {
    const trendWord = entity.mentionsGrowth > 15 ? "accelerating" : entity.mentionsGrowth > 0 ? "steady" : "slowing";
    return {
      executiveSummary: `${entity.name} shows ${trendWord} activity, with mentions ${formatChange(entity.mentionsGrowth)} and engagement ${formatChange(entity.engagementGrowth)} over the tracked period. Sentiment is currently ${sentimentLabel(entity.sentiment).toLowerCase()} at ${entity.sentiment}%.`,
      keyTrends: [
        `Posting frequency: ~${entity.postingFrequencyPerWeek} posts/week`,
        `Primary content category: ${entity.topContentCategory}`,
        `Follower growth: ${formatChange(entity.followerGrowth)}`,
      ],
      topTopics: entity.topTopics,
      sentiment: { score: entity.sentiment, label: sentimentLabel(entity.sentiment) },
      changes: [
        `Mentions moved ${formatChange(entity.mentionsGrowth)} versus the prior period.`,
        `Engagement moved ${formatChange(entity.engagementGrowth)} versus the prior period.`,
      ],
      actions: [
        entity.mentionsGrowth > 15
          ? `Monitor ${entity.name} closely — activity is accelerating faster than the tracked average.`
          : `Maintain standard monitoring cadence for ${entity.name}.`,
        `Benchmark your own ${entity.topContentCategory.toLowerCase()} content against ${entity.name}'s recent posts.`,
      ],
    };
  }

  // influencer
  const growthWord = entity.followerGrowth > 12 ? "rapid" : entity.followerGrowth > 0 ? "steady" : "flat";
  return {
    executiveSummary: `${entity.name} (${entity.handle}) is experiencing ${growthWord} follower growth at ${formatChange(entity.followerGrowth)}, with a ${entity.engagementRate}% engagement rate — placing them in the ${entity.influenceScore >= 80 ? "top tier" : entity.influenceScore >= 60 ? "upper-middle tier" : "emerging tier"} of tracked creators.`,
    keyTrends: [
      `Category: ${entity.category}`,
      `Influence score: ${entity.influenceScore}/100`,
      `Top content category: ${entity.topContentCategory}`,
    ],
    topTopics: [entity.category, entity.topContentCategory],
    sentiment: { score: entity.sentiment, label: sentimentLabel(entity.sentiment) },
    changes: [`Followers moved ${formatChange(entity.followerGrowth)} over the tracked period.`],
    actions: [
      entity.influenceScore >= 80 ? "Strong candidate for a paid collaboration or co-branded campaign." : "Worth a lightweight organic partnership test before committing budget.",
      `Best content category to align with: ${entity.topContentCategory}.`,
      entity.followerGrowth > 10 ? "Recommended campaign timing: within the next 2–3 weeks, while momentum is high." : "Recommended campaign timing: no urgency — growth is stable.",
    ],
  };
}

export function buildCsv(rows, columns) {
  const header = columns.map((c) => `"${c.label}"`).join(",");
  const lines = rows.map((row) =>
    columns
      .map((c) => {
        const v = row[c.key];
        return `"${String(v ?? "").replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  return [header, ...lines].join("\n");
}

export function downloadFile(filename, content, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
