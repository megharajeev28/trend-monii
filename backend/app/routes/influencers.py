from fastapi import APIRouter, HTTPException

from app.services import data_service

router = APIRouter(tags=["influencers"])


@router.get("/api/influencers")
def list_influencers():
    return data_service.get_influencers()


@router.get("/api/influencers/{influencer_id}")
def get_influencer(influencer_id: str):
    influencer = data_service.get_influencer(influencer_id)
    if influencer is None:
        raise HTTPException(status_code=404, detail=f"Influencer '{influencer_id}' not found")
    return influencer
