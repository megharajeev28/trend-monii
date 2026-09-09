// Builds the four report types shown on the Reports page from already-loaded
// demo/live data. Pure functions so they're easy to unit test and reuse from
// the CSV/JSON export buttons.

import { formatChange, formatCompact, compareCompetitors } from "../services/analytics.js";

export function buildWeeklyCompetitiveReport({ competitors, dashboard }) {
  const sorted = [...competitors].sort((a, b) => b.mentionsGrowth - a.mentionsGrowth);
  const fastest = sorted[0];
  const summary = `Across ${competitors.length} tracked competitors, total mentions moved ${formatChange(
    dashboard.kpis.totalMentions.change
  )} and engagement moved ${formatChange(dashboard.kpis.engagement.change)} this period. ${fastest.name} grew fastest at ${formatChange(
    fastest.mentionsGrowth
  )}.`;

  return {
    title: "Weekly Competitive Report",
    summary,
    rows: competitors.map((c) => ({
      name: c.name,
      mentions: c.mentions,
      engagement: c.engagement,
      sentiment: `${c.sentiment}%`,
      growth: formatChange(c.mentionsGrowth),
      trend: c.trend,
    })),
    columns: [
      { key: "name", label: "Competitor" },
      { key: "mentions", label: "Mentions" },
      { key: "engagement", label: "Engagement" },
      { key: "sentiment", label: "Sentiment" },
      { key: "growth", label: "Growth" },
      { key: "trend", label: "Trend" },
    ],
  };
}

export function buildInfluencerReport({ influencers }) {
  const trending = influencers.filter((i) => i.trending);
  const summary = `${trending.length} of ${influencers.length} tracked influencers are currently trending. The strongest follower growth belongs to ${
    [...influencers].sort((a, b) => b.followerGrowth - a.followerGrowth)[0].name
  }.`;

  return {
    title: "Influencer Report",
    summary,
    rows: influencers.map((i) => ({
      name: i.name,
      handle: i.handle,
      category: i.category,
      followers: i.followers,
      engagementRate: `${i.engagementRate}%`,
      growth: formatChange(i.followerGrowth),
      influenceScore: i.influenceScore,
    })),
    columns: [
      { key: "name", label: "Influencer" },
      { key: "handle", label: "Handle" },
      { key: "category", label: "Category" },
      { key: "followers", label: "Followers" },
      { key: "engagementRate", label: "Engagement Rate" },
      { key: "growth", label: "Growth" },
      { key: "influenceScore", label: "Influence Score" },
    ],
  };
}

export function buildTrendReport({ trends }) {
  const emerging = trends.filter((t) => t.status === "Emerging" || t.status === "Rising");
  const summary = `${emerging.length} topics are currently Emerging or Rising. ${trends[0].name} leads overall growth at ${formatChange(
    trends[0].growth
  )}.`;

  return {
    title: "Trend Report",
    summary,
    rows: trends.map((t) => ({
      name: t.name,
      growth: formatChange(t.growth),
      mentions: t.mentions,
      engagement: t.engagement,
      momentum: t.momentum,
      status: t.status,
    })),
    columns: [
      { key: "name", label: "Topic" },
      { key: "growth", label: "Growth" },
      { key: "mentions", label: "Mentions" },
      { key: "engagement", label: "Engagement" },
      { key: "momentum", label: "Momentum" },
      { key: "status", label: "Status" },
    ],
  };
}

export function buildSentimentReport({ sentimentTopics }) {
  const worst = [...sentimentTopics].sort((a, b) => b.negative - a.negative)[0];
  const summary = `${worst.topic} carries the highest negative sentiment share at ${worst.negative}%, worth prioritizing for a response.`;

  return {
    title: "Sentiment Report",
    summary,
    rows: sentimentTopics.map((t) => ({
      topic: t.topic,
      positive: `${t.positive}%`,
      neutral: `${t.neutral}%`,
      negative: `${t.negative}%`,
    })),
    columns: [
      { key: "topic", label: "Topic" },
      { key: "positive", label: "Positive" },
      { key: "neutral", label: "Neutral" },
      { key: "negative", label: "Negative" },
    ],
  };
}
