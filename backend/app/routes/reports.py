from fastapi import APIRouter, Query

from app.services import data_service

router = APIRouter(tags=["reports"])


@router.get("/api/reports")
def reports(
    report_type: str = Query("weekly_competitive", alias="type"),
):
    """
    Assembles a report payload from existing demo data. The frontend renders this
    into a preview and can also export it directly as CSV/JSON without hitting
    this endpoint, so the backend and the frontend-only demo path stay in sync.
    """
    if report_type == "influencer":
        return {"type": report_type, "generatedAt": _now(), "items": data_service.get_influencers()}
    if report_type == "trend":
        return {"type": report_type, "generatedAt": _now(), "items": data_service.get_trends()}
    if report_type == "sentiment":
        return {"type": report_type, "generatedAt": _now(), "items": data_service.get_sentiment()}
    return {"type": "weekly_competitive", "generatedAt": _now(), "items": data_service.get_competitors()}


def _now() -> str:
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).isoformat()
