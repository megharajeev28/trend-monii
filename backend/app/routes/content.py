from fastapi import APIRouter

from app.services import data_service

router = APIRouter(tags=["content"])


@router.get("/api/content")
def content():
    data = data_service.get_content()
    posts = data_service.get_posts()
    return {**data, "posts": posts}
