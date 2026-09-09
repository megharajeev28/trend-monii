"""
Lightweight, dependency-friendly NLP engine.

Everything here is deterministic on purpose: given the same input, `analyze_sentiment`,
`extract_keywords`, `detect_topics`, `calculate_trend_score`, and `generate_summary` always
return the same output. That keeps demo walkthroughs stable and makes the pipeline testable,
while still doing genuine text processing rather than returning canned strings.

Swap the lexicon-based scoring below for a transformer model (e.g. a HuggingFace pipeline)
without changing any function signature — every route in app/routes calls these functions,
never a specific implementation.
"""

import re
from collections import Counter
from typing import Iterable

# --- Lexicons -----------------------------------------------------------------

POSITIVE_WORDS = {
    "great", "growth", "grow", "growing", "love", "amazing", "excellent", "win", "winning",
    "innovative", "improve", "improved", "improving", "strong", "success", "successful",
    "helpful", "impressive", "fast", "reliable", "trust", "trusted", "best", "leading",
    "breakthrough", "efficient", "delight", "delighted", "recommend", "outperform",
    "outperforms", "gain", "gained", "boost", "boosted", "record", "milestone",
}

NEGATIVE_WORDS = {
    "bug", "bugs", "issue", "issues", "problem", "problems", "slow", "expensive", "overpriced",
    "confusing", "broken", "down", "outage", "delay", "delayed", "disappointed", "disappointing",
    "poor", "bad", "worse", "worst", "complaint", "complaints", "frustrating", "churn", "cancel",
    "cancelled", "declining", "decline", "drop", "dropped", "fail", "failed", "failure", "risky",
    "concern", "concerns", "expensive", "costly", "downtime",
}

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with", "is", "are",
    "was", "were", "be", "been", "being", "it", "its", "this", "that", "these", "those", "as",
    "at", "by", "from", "we", "our", "you", "your", "they", "their", "has", "have", "had",
    "will", "would", "can", "could", "just", "than", "then", "into", "about", "over", "up",
    "out", "so", "if", "not", "no", "do", "does", "did", "i", "us", "them", "he", "she",
}

TOPIC_KEYWORDS = {
    "Generative AI": {"generative", "genai", "llm", "gpt", "diffusion"},
    "AI Agents": {"agent", "agents", "autonomous", "orchestration"},
    "Automation": {"automation", "automate", "workflow", "workflows", "no-code"},
    "Cloud Security": {"cloud", "security", "breach", "vulnerability", "zero-trust"},
    "Cybersecurity": {"cyber", "cybersecurity", "ransomware", "phishing", "malware"},
    "Pricing": {"pricing", "price", "cost", "subscription", "plan"},
    "Product Features": {"feature", "features", "release", "launch", "update"},
    "Customer Support": {"support", "helpdesk", "response", "ticket", "service"},
    "Developer Experience": {"developer", "sdk", "api", "docs", "documentation"},
    "Data Privacy": {"privacy", "gdpr", "data", "consent", "compliance"},
}

TOKEN_RE = re.compile(r"[a-zA-Z][a-zA-Z\-']+")


def _tokenize(text: str) -> list[str]:
    return [t.lower() for t in TOKEN_RE.findall(text or "")]


def analyze_sentiment(text: str) -> dict:
    """Lexicon-based sentiment scoring, normalized to a 0-100 'positivity' score."""
    tokens = _tokenize(text)
    if not tokens:
        return {"score": 50, "label": "Neutral", "positive_hits": 0, "negative_hits": 0}

    pos = sum(1 for t in tokens if t in POSITIVE_WORDS)
    neg = sum(1 for t in tokens if t in NEGATIVE_WORDS)
    total_signal = pos + neg

    if total_signal == 0:
        score = 55  # mildly-neutral baseline, matches product's demo tone
    else:
        # Score centers at 50; each net signal word nudges it, capped at 0-100.
        raw = 50 + ((pos - neg) / max(total_signal, 1)) * 45
        score = max(0, min(100, round(raw)))

    label = "Positive" if score >= 65 else "Negative" if score <= 40 else "Neutral"
    return {"score": score, "label": label, "positive_hits": pos, "negative_hits": neg}


def extract_keywords(text: str, top_n: int = 8) -> list[str]:
    """Frequency-based keyword extraction with stopword removal."""
    tokens = [t for t in _tokenize(text) if t not in STOPWORDS and len(t) > 2]
    if not tokens:
        return []
    counts = Counter(tokens)
    return [word for word, _ in counts.most_common(top_n)]


def detect_topics(text: str) -> list[str]:
    """Maps extracted keywords onto a fixed taxonomy of business-relevant topics."""
    tokens = set(_tokenize(text))
    matched = []
    for topic, keywords in TOPIC_KEYWORDS.items():
        if tokens & keywords:
            matched.append(topic)
    return matched


def calculate_trend_score(mentions_growth: float, engagement_growth: float, velocity_days: int = 7) -> dict:
    """
    Combines mention growth and engagement growth into a single 0-100 momentum score,
    plus a status label. Weighted toward engagement growth since it better signals
    genuine audience interest versus one-off posting spikes.
    """
    raw = (mentions_growth * 0.4) + (engagement_growth * 0.6)
    score = max(0, min(100, round(50 + raw)))

    if raw >= 30:
        status = "Emerging"
    elif raw >= 12:
        status = "Rising"
    elif raw >= -5:
        status = "Stable"
    else:
        status = "Declining"

    confidence = max(50, min(97, round(60 + abs(raw) * 0.6)))
    return {"score": score, "status": status, "confidence": confidence}


def generate_summary(entity_type: str, entity: dict | None) -> dict:
    """Deterministic executive-summary generator, mirroring frontend analytics.js."""
    if not entity:
        return {
            "executiveSummary": "No data available for this entity.",
            "keyTrends": [],
            "topTopics": [],
            "sentiment": None,
            "changes": [],
            "actions": [],
        }

    def pct(v: float) -> str:
        sign = "+" if v > 0 else ""
        return f"{sign}{v:.1f}%"

    if entity_type == "competitor":
        mg = entity.get("mentionsGrowth", 0)
        eg = entity.get("engagementGrowth", 0)
        trend_word = "accelerating" if mg > 15 else "steady" if mg > 0 else "slowing"
        sentiment_score = entity.get("sentiment", 50)
        sentiment_label = "Positive" if sentiment_score >= 65 else "Negative" if sentiment_score <= 40 else "Neutral"
        return {
            "executiveSummary": (
                f"{entity['name']} shows {trend_word} activity, with mentions {pct(mg)} and "
                f"engagement {pct(eg)} over the tracked period. Sentiment is currently "
                f"{sentiment_label.lower()} at {sentiment_score}%."
            ),
            "keyTrends": [
                f"Posting frequency: ~{entity.get('postingFrequencyPerWeek', 0)} posts/week",
                f"Primary content category: {entity.get('topContentCategory', 'N/A')}",
                f"Follower growth: {pct(entity.get('followerGrowth', 0))}",
            ],
            "topTopics": entity.get("topTopics", []),
            "sentiment": {"score": sentiment_score, "label": sentiment_label},
            "changes": [
                f"Mentions moved {pct(mg)} versus the prior period.",
                f"Engagement moved {pct(eg)} versus the prior period.",
            ],
            "actions": [
                f"Monitor {entity['name']} closely — activity is accelerating faster than the tracked average."
                if mg > 15 else f"Maintain standard monitoring cadence for {entity['name']}.",
                f"Benchmark your own {entity.get('topContentCategory', 'content').lower()} content against {entity['name']}'s recent posts.",
            ],
        }

    # influencer
    fg = entity.get("followerGrowth", 0)
    score = entity.get("influenceScore", 0)
    growth_word = "rapid" if fg > 12 else "steady" if fg > 0 else "flat"
    tier = "top tier" if score >= 80 else "upper-middle tier" if score >= 60 else "emerging tier"
    sentiment_score = entity.get("sentiment", 50)
    sentiment_label = "Positive" if sentiment_score >= 65 else "Negative" if sentiment_score <= 40 else "Neutral"
    return {
        "executiveSummary": (
            f"{entity['name']} ({entity.get('handle', '')}) is experiencing {growth_word} follower "
            f"growth at {pct(fg)}, with a {entity.get('engagementRate', 0)}% engagement rate — "
            f"placing them in the {tier} of tracked creators."
        ),
        "keyTrends": [
            f"Category: {entity.get('category', 'N/A')}",
            f"Influence score: {score}/100",
            f"Top content category: {entity.get('topContentCategory', 'N/A')}",
        ],
        "topTopics": [entity.get("category", ""), entity.get("topContentCategory", "")],
        "sentiment": {"score": sentiment_score, "label": sentiment_label},
        "changes": [f"Followers moved {pct(fg)} over the tracked period."],
        "actions": [
            "Strong candidate for a paid collaboration or co-branded campaign." if score >= 80
            else "Worth a lightweight organic partnership test before committing budget.",
            f"Best content category to align with: {entity.get('topContentCategory', 'N/A')}.",
            "Recommended campaign timing: within the next 2–3 weeks, while momentum is high." if fg > 10
            else "Recommended campaign timing: no urgency — growth is stable.",
        ],
    }


def analyze_text(text: str) -> dict:
    """Full pipeline for POST /api/analyze: sentiment + keywords + topics in one call."""
    sentiment = analyze_sentiment(text)
    keywords = extract_keywords(text)
    topics = detect_topics(text)
    return {"sentiment": sentiment, "keywords": keywords, "topics": topics}
