from fastapi import APIRouter

from app.schemas.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/api/health", response_model=HealthResponse)
def health():
    return HealthResponse()
