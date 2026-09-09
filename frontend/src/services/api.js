// Data-source abstraction layer.
//
// TrendMoni can run in two modes:
//  - "live": VITE_API_URL is set and the FastAPI backend responds. Data is fetched over HTTP.
//  - "demo": no backend URL is configured, or the backend is unreachable. Local mock data
//            (src/data/*.js) is used instead so the product works standalone on Vercel.
//
// Every exported function returns the same shape regardless of mode, so pages never need to
// know which source served the data. Swap DemoDataProvider-shaped calls below for real social
// APIs (Twitter/X, Reddit, YouTube, News) without touching any page component.

import { competitors } from "../data/competitors.js";
import { influencers } from "../data/influencers.js";
import { trends } from "../data/trends.js";
import { posts } from "../data/posts.js";
import { sentimentTopics, overallSentimentSeries } from "../data/sentiment.js";
import { dashboardData } from "../data/dashboard.js";
import { contentIntelligence } from "../data/content.js";
import { seriesDates, topicsPool, platformsList, categoriesList } from "../data/meta.js";
import { generateSummary } from "./analytics.js";

const API_URL = import.meta.env.VITE_API_URL || "";
const REQUEST_TIMEOUT_MS = 2500;

let dataSourceStatus = API_URL ? "checking" : "demo";
const statusListeners = new Set();

function setStatus(next) {
  if (dataSourceStatus === next) return;
  dataSourceStatus = next;
  statusListeners.forEach((fn) => fn(dataSourceStatus));
}

export function getDataSourceStatus() {
  return dataSourceStatus;
}

export function onDataSourceStatusChange(fn) {
  statusListeners.add(fn);
  return () => statusListeners.delete(fn);
}

async function fetchWithTimeout(path, options = {}) {
  if (!API_URL) throw new Error("No API URL configured");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, signal: controller.signal });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const json = await res.json();
    setStatus("live");
    return json;
  } finally {
    clearTimeout(timer);
  }
}

// Small artificial delay so demo mode still feels like it's "loading" data,
// which keeps skeleton states honest during a live walkthrough.
function demoDelay(ms = 380) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withFallback(path, demoValue) {
  if (API_URL) {
    try {
      return await fetchWithTimeout(path);
    } catch (err) {
      setStatus("demo");
    }
  }
  await demoDelay();
  return demoValue;
}

export async function getDashboard() {
  return withFallback("/api/dashboard", dashboardData);
}

export async function getCompetitors() {
  return withFallback("/api/competitors", competitors);
}

export async function getCompetitor(id) {
  const all = await getCompetitors();
  return all.find((c) => c.id === id) || null;
}

export async function getInfluencers() {
  return withFallback("/api/influencers", influencers);
}

export async function getInfluencer(id) {
  const all = await getInfluencers();
  return all.find((i) => i.id === id) || null;
}

export async function getTrends() {
  return withFallback("/api/trends", trends);
}

export async function getSentiment() {
  return withFallback("/api/sentiment", { topics: sentimentTopics, series: overallSentimentSeries });
}

export async function getContent() {
  const posts_ = await withFallback("/api/content", { posts, categoryEngagement: contentIntelligence.categoryEngagement });
  return posts_;
}

export async function getMeta() {
  return { seriesDates, topicsPool, platforms: platformsList, categories: categoriesList };
}

export async function postSummarize(entityType, entityId) {
  if (API_URL) {
    try {
      return await fetchWithTimeout("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity_type: entityType, entity_id: entityId }),
      });
    } catch (err) {
      setStatus("demo");
    }
  }
  await demoDelay(600);
  const pool = entityType === "competitor" ? competitors : influencers;
  const entity = pool.find((e) => e.id === entityId);
  return generateSummary(entityType, entity);
}

export async function globalSearch(query) {
  await demoDelay(150);
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results = [];

  competitors.forEach((c) => {
    if (c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)) {
      results.push({ type: "Competitor", id: c.id, name: c.name, metric: `${c.mentions.toLocaleString()} mentions` });
    }
  });
  influencers.forEach((i) => {
    if (i.name.toLowerCase().includes(q) || i.handle.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)) {
      results.push({ type: "Influencer", id: i.id, name: i.name, metric: `${i.followers.toLocaleString()} followers` });
    }
  });
  trends.forEach((t) => {
    if (t.name.toLowerCase().includes(q)) {
      results.push({ type: "Trend", id: t.id, name: t.name, metric: `${t.growth > 0 ? "+" : ""}${t.growth}% growth` });
    }
  });
  topicsPool.forEach((topic) => {
    if (topic.toLowerCase().includes(q) && !results.some((r) => r.type === "Trend" && r.name === topic)) {
      results.push({ type: "Topic", id: topic, name: topic, metric: "Tracked topic" });
    }
  });

  return results.slice(0, 12);
}
