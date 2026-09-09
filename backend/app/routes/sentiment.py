from fastapi import APIRouter

from app.services import data_service

router = APIRouter(tags=["sentiment"])


@router.get("/api/sentiment")
def sentiment():
    return data_service.get_sentiment()
