from fastapi import APIRouter, HTTPException

from app.services import data_service

router = APIRouter(tags=["competitors"])


@router.get("/api/competitors")
def list_competitors():
    return data_service.get_competitors()


@router.get("/api/competitors/{competitor_id}")
def get_competitor(competitor_id: str):
    competitor = data_service.get_competitor(competitor_id)
    if competitor is None:
        raise HTTPException(status_code=404, detail=f"Competitor '{competitor_id}' not found")
    return competitor
