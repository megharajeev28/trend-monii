import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import (
    analyze,
    competitors,
    content,
    dashboard,
    health,
    influencers,
    reports,
    search,
    sentiment,
    summarize,
    trends,
)

app = FastAPI(
    title="TrendMoni API",
    description=(
        "Real-time influencer & competitor intelligence API. Currently serving structured "
        "demo data — see app/providers for the interface real social-data providers implement."
    ),
    version="1.0.0",
)

# CORS: comma-separated origins via CORS_ORIGINS env var. Defaults cover local Vite dev
# and a same-origin Vercel deployment; tighten this for production.
_default_origins = "http://localhost:5173,http://127.0.0.1:5173"
origins = [o.strip() for o in os.getenv("CORS_ORIGINS", _default_origins).split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(dashboard.router)
app.include_router(competitors.router)
app.include_router(influencers.router)
app.include_router(trends.router)
app.include_router(sentiment.router)
app.include_router(content.router)
app.include_router(analyze.router)
app.include_router(summarize.router)
app.include_router(reports.router)
app.include_router(search.router)


@app.get("/", tags=["health"])
def root():
    return {
        "service": "TrendMoni API",
        "status": "ok",
        "docs": "/docs",
        "mode": "demo",
    }
