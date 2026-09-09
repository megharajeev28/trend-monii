from fastapi import APIRouter, HTTPException

from app.services import data_service

router = APIRouter(tags=["trends"])


@router.get("/api/trends")
def list_trends():
    return data_service.get_trends()


@router.get("/api/trends/{trend_id}")
def get_trend(trend_id: str):
    trend = data_service.get_trend(trend_id)
    if trend is None:
        raise HTTPException(status_code=404, detail=f"Trend '{trend_id}' not found")
    return trend
