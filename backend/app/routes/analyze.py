from fastapi import APIRouter

from app.schemas.schemas import AnalyzeRequest, AnalyzeResponse
from app.services import nlp_service

router = APIRouter(tags=["nlp"])


@router.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest):
    return nlp_service.analyze_text(payload.text)
