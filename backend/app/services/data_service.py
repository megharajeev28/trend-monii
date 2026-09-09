"""
Data access layer. Every route goes through this module instead of touching JSON
files directly, so swapping demo data for a real database or the provider layer in
app/providers/ later only requires changes here.
"""

import json
from functools import lru_cache
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


@lru_cache(maxsize=None)
def _load(filename: str):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def get_dashboard() -> dict:
    return _load("dashboard.json")


def get_competitors() -> list[dict]:
    return _load("competitors.json")


def get_competitor(competitor_id: str) -> dict | None:
    return next((c for c in get_competitors() if c["id"] == competitor_id), None)


def get_influencers() -> list[dict]:
    return _load("influencers.json")


def get_influencer(influencer_id: str) -> dict | None:
    return next((i for i in get_influencers() if i["id"] == influencer_id), None)


def get_trends() -> list[dict]:
    return _load("trends.json")


def get_trend(trend_id: str) -> dict | None:
    return next((t for t in get_trends() if t["id"] == trend_id), None)


def get_sentiment() -> dict:
    return _load("sentiment.json")


def get_posts() -> list[dict]:
    return _load("posts.json")


def get_content() -> dict:
    return _load("content.json")


def get_meta() -> dict:
    return _load("meta.json")


def search(query: str) -> list[dict]:
    q = query.strip().lower()
    if not q:
        return []
    results = []

    for c in get_competitors():
        if q in c["name"].lower() or q in c["industry"].lower():
            results.append({"type": "Competitor", "id": c["id"], "name": c["name"], "metric": f"{c['mentions']:,} mentions"})

    for i in get_influencers():
        if q in i["name"].lower() or q in i["handle"].lower() or q in i["category"].lower():
            results.append({"type": "Influencer", "id": i["id"], "name": i["name"], "metric": f"{i['followers']:,} followers"})

    for t in get_trends():
        if q in t["name"].lower():
            results.append({"type": "Trend", "id": t["id"], "name": t["name"], "metric": f"{'+' if t['growth'] > 0 else ''}{t['growth']}% growth"})

    for topic in get_meta().get("topicsPool", []):
        if q in topic.lower() and not any(r["type"] == "Trend" and r["name"] == topic for r in results):
            results.append({"type": "Topic", "id": topic, "name": topic, "metric": "Tracked topic"})

    return results[:12]
