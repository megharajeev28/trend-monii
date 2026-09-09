from fastapi import APIRouter, Query

from app.services import data_service

router = APIRouter(tags=["search"])


@router.get("/api/search")
def search(q: str = Query("", description="Search query across competitors, influencers, trends, and topics")):
    return data_service.search(q)
