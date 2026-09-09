from fastapi import APIRouter

from app.services import data_service

router = APIRouter(tags=["dashboard"])


@router.get("/api/dashboard")
def dashboard():
    return data_service.get_dashboard()
