from fastapi import APIRouter, HTTPException

from app.schemas.schemas import SummarizeRequest, SummarizeResponse
from app.services import data_service, nlp_service

router = APIRouter(tags=["nlp"])


@router.post("/api/summarize", response_model=SummarizeResponse)
def summarize(payload: SummarizeRequest):
    if payload.entity_type == "competitor":
        entity = data_service.get_competitor(payload.entity_id)
    else:
        entity = data_service.get_influencer(payload.entity_id)

    if entity is None:
        raise HTTPException(status_code=404, detail=f"{payload.entity_type} '{payload.entity_id}' not found")

    return nlp_service.generate_summary(payload.entity_type, entity)
