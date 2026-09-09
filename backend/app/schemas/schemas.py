from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    mode: Literal["demo"] = "demo"
    service: str = "trendmoni-api"


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Raw text to run through the NLP pipeline")


class AnalyzeResponse(BaseModel):
    sentiment: dict[str, Any]
    keywords: list[str]
    topics: list[str]


class SummarizeRequest(BaseModel):
    entity_type: Literal["competitor", "influencer"]
    entity_id: str


class SummarizeResponse(BaseModel):
    executiveSummary: str
    keyTrends: list[str]
    topTopics: list[str]
    sentiment: Optional[dict[str, Any]] = None
    changes: list[str]
    actions: list[str]


class SearchResult(BaseModel):
    type: Literal["Competitor", "Influencer", "Trend", "Topic"]
    id: str
    name: str
    metric: str


class ReportRequest(BaseModel):
    report_type: Literal["weekly_competitive", "influencer", "trend", "sentiment"]
    format: Literal["json", "csv"] = "json"
