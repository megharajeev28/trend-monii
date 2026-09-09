# TrendMoni API (backend)

FastAPI service that structures competitor, influencer, trend, sentiment, and content data
and runs it through a lightweight NLP pipeline (`app/services/nlp_service.py`).

The API is **optional** — the frontend works standalone in Demo Mode using its own copy of
the same fixtures. Run this backend when you want a real HTTP layer to develop against, or
as the foundation for wiring up live data providers.

## Run locally

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API is now at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Service status |
| GET | `/api/dashboard` | KPI summary + AI insights for the overview page |
| GET | `/api/competitors` | All tracked competitors |
| GET | `/api/competitors/{id}` | Single competitor detail |
| GET | `/api/influencers` | All tracked influencers |
| GET | `/api/influencers/{id}` | Single influencer detail |
| GET | `/api/trends` | Trending topics + momentum |
| GET | `/api/sentiment` | Sentiment breakdown + time series |
| GET | `/api/content` | Top-performing content + category engagement |
| GET | `/api/search?q=` | Global search across all entities |
| POST | `/api/analyze` | Run the NLP pipeline on arbitrary text |
| POST | `/api/summarize` | Generate an executive summary for a competitor or influencer |
| GET | `/api/reports?type=` | Assemble report data for export |

## Architecture

```
app/
├── main.py                 FastAPI app, CORS, router registration
├── routes/                 One file per resource — thin, calls services only
├── services/
│   ├── data_service.py     Loads/queries the JSON fixtures in app/data/
│   └── nlp_service.py      Sentiment, keyword extraction, topic detection, trend scoring, summarization
├── providers/               Data-source interface: DemoDataProvider (active) +
│                            Twitter/Reddit/YouTube/News placeholders for future live integration
├── schemas/                 Pydantic request/response models
└── data/                    Bundled demo fixtures (20 competitors, 50 influencers, 100 posts, 20 trends)
```

## Environment variables

See `.env.example` in the repo root. `CORS_ORIGINS` controls which frontend origins may call
this API — set it to your deployed frontend URL in production.

## Notes on the NLP engine

`nlp_service.py` uses lexicon-based sentiment scoring and frequency-based keyword extraction —
deliberately lightweight so the service starts instantly with no model downloads. The functions
are pure and deterministic, so they're straightforward to unit test and to later swap for a
transformer pipeline (e.g. `transformers.pipeline("sentiment-analysis")`) without touching any route.
