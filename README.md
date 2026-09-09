# TrendMoni

**Real-Time Influencer & Competitor Intelligence Platform**

TrendMoni is an AI-powered competitive intelligence platform that transforms large volumes
of social-media and market data into actionable insights for brands and businesses. It
combines data processing, NLP, trend detection, sentiment analysis, competitor monitoring,
influencer intelligence, and automated summarization to help users identify opportunities
and make faster data-driven decisions.

![Demo Mode](https://img.shields.io/badge/data-demo%20mode-F5A524) ![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-3A54F5) ![FastAPI](https://img.shields.io/badge/backend-FastAPI-00A891)

## Screenshots

_Add screenshots of the Overview, Competitors, Trends, and Sentiment pages here once deployed._

```
docs/screenshots/overview.png
<img width="1919" height="935" alt="image" src="https://github.com/user-attachments/assets/2ab077c8-d064-4cbf-b2f8-9a7f524d49cc" />

<img width="1919" height="1018" alt="image" src="https://github.com/user-attachments/assets/13631b79-3f69-4de0-99c5-f930c5b39dbb" />

docs/screenshots/competitors.png
<img width="1919" height="940" alt="image" src="https://github.com/user-attachments/assets/b110dc21-367a-4d01-b740-8e069f75e60b" />

docs/screenshots/trends.png
<img width="1917" height="931" alt="image" src="https://github.com/user-attachments/assets/d7d4fdc5-d2e4-43ef-bf4a-3ffb3f30a7f1" />

<img width="1916" height="756" alt="image" src="https://github.com/user-attachments/assets/0ff9c1de-a14b-4d5b-8c25-998a8b9dca55" />

docs/screenshots/sentiment.png
```
<img width="1917" height="937" alt="image" src="https://github.com/user-attachments/assets/6f772ff9-0219-40b3-866c-3ade31f441fd" />

<img width="1918" height="904" alt="image" src="https://github.com/user-attachments/assets/12acd274-724f-43ef-8c63-760dbedc3116" />
<img width="1901" height="936" alt="image" src="https://github.com/user-attachments/assets/4b498edd-ba77-4459-97d8-0bc1765bf8df" />
<img width="1911" height="933" alt="image" src="https://github.com/user-attachments/assets/5fbffbbc-51e4-4982-8394-62b5cfb0224c" />



## Problem Statement

Marketing and product teams spend hours manually scrolling competitor feeds and influencer
profiles to answer basic questions: *What are competitors doing? Which influencers are
growing? What's trending? What should we do next?* That process doesn't scale, and raw
metrics ("Competitor X posted 17 times this week") don't translate into decisions on their
own.

## Solution

TrendMoni ingests social-media activity (via demo fixtures today, pluggable live providers
tomorrow), runs it through an NLP pipeline — sentiment analysis, keyword extraction, topic
detection, trend scoring, and summarization — and surfaces the output as structured,
decision-ready insights with a recommended action attached to each one:

> Instead of "Competitor X posted 17 times this week", TrendMoni says: **"Competitor X
> increased posting frequency by 34% this week and generated 18% higher engagement. Their
> strongest content category was short-form educational content."**

## Features

- **Competitor Intelligence** — mentions, engagement, sentiment, posting cadence, and a
  side-by-side comparison tool with an AI-generated conclusion.
- **Influencer Discovery** — a ranked, filterable table of creators with an influence score
  blending reach, growth, and engagement.
- **Trend Detection** — momentum-scored topics (Emerging / Rising / Stable / Declining) and
  an Opportunity Engine that pairs each trend with a confidence score and a recommended
  next action.
- **Sentiment Analysis** — overall split, sentiment over time, topic-level sentiment, a
  competitor sentiment comparison, and automatic alerts on negative-sentiment spikes.
- **Content Intelligence** — which formats and categories actually drive engagement.
- **AI Summaries** — one-click executive summaries for any competitor or influencer.
- **Reports** — generate and export (CSV/JSON) four report types from live dashboard data.
- **Global search**, functional filters throughout, and a full loading/empty/error state
  system — nothing is a static mockup.
- **Demo Mode** — the entire frontend runs standalone on realistic simulated data and
  clearly labels itself as such; point it at the FastAPI backend to go live.

## Architecture

```
                 ┌──────────────────────────┐
                 │   React + Vite frontend   │
                 │  (Demo Mode by default)   │
                 └─────────────┬─────────────┘
                               │ src/services/api.js
                               │ (falls back to demo data on any failure)
                               ▼
                 ┌──────────────────────────┐
                 │      FastAPI backend      │
                 │  routes → services → data │
                 └─────────────┬─────────────┘
                               │ app/providers/*
                               ▼
        ┌───────────────┬───────────────┬───────────────┬───────────────┐
        │ DemoProvider   │ Twitter/X     │ Reddit        │ YouTube/News  │
        │ (active)       │ (placeholder) │ (placeholder) │ (placeholder) │
        └───────────────┴───────────────┴───────────────┴───────────────┘
```

The frontend never talks to social APIs directly — it always goes through
`src/services/api.js`, which is the single place that decides whether to call the backend
or fall back to bundled demo data. Swapping demo data for live data later means implementing
the provider interface in `backend/app/providers/`, not touching any UI component.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Recharts, lucide-react
**Backend:** FastAPI, Pydantic, Pandas, scikit-learn
**NLP:** lightweight deterministic sentiment analysis, keyword extraction, topic detection,
trend scoring, and text summarization (`backend/app/services/nlp_service.py`)

## Installation

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd trendmoni
cp .env.example frontend/.env    # optional — demo mode needs no env vars at all
cp .env.example backend/.env     # optional
```

### Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. This works with **no backend running at all**.

### Running the backend (optional)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs at `http://localhost:8000/docs`. Set `VITE_API_URL=http://localhost:8000` in
`frontend/.env` to have the frontend use it instead of demo data.

## Environment Variables

See [`.env.example`](./.env.example). Nothing is required for Demo Mode. `OPENAI_API_KEY`,
`NEWS_API_KEY`, and the social platform keys are placeholders for future live-provider
integrations and are never read by the frontend.

## API Documentation

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Service status |
| GET | `/api/dashboard` | KPIs, AI insights, opportunities |
| GET | `/api/competitors` | All tracked competitors |
| GET | `/api/competitors/{id}` | Single competitor detail |
| GET | `/api/influencers` | All tracked influencers |
| GET | `/api/influencers/{id}` | Single influencer detail |
| GET | `/api/trends` | Trending topics + momentum |
| GET | `/api/sentiment` | Sentiment breakdown + time series |
| GET | `/api/content` | Top-performing content + category engagement |
| GET | `/api/search?q=` | Global search |
| POST | `/api/analyze` | Run the NLP pipeline on arbitrary text |
| POST | `/api/summarize` | AI-style executive summary for an entity |
| GET | `/api/reports?type=` | Assemble report data |

Full interactive docs are served by FastAPI at `/docs` when the backend is running.

## Deployment

**Frontend → Vercel** (works standalone in Demo Mode):

1. Push this repo to GitHub.
2. In Vercel: **Add New Project → Import** this repository.
3. Set **Root Directory** to `frontend`.
4. Build command: `npm run build`. Output directory: `dist`.
5. (Optional) Add environment variable `VITE_API_URL` if you deploy the backend too.

**Backend → Render / Railway** (optional, for a real HTTP layer):

Deploy `backend/` as a standard FastAPI service (`uvicorn app.main:app --host 0.0.0.0
--port $PORT`), set `CORS_ORIGINS` to your Vercel URL, then set `VITE_API_URL` on the
frontend to the deployed backend URL.

If you skip the backend entirely, the deployed frontend still works end-to-end on demo
data — this is the simplest path for a portfolio link.

## Project Structure

```
trendmoni/
├── frontend/
│   ├── src/
│   │   ├── components/   Reusable UI components
│   │   ├── pages/        One file per route
│   │   ├── layouts/      Sidebar, TopNavbar, DashboardLayout
│   │   ├── services/     api.js, analytics.js
│   │   ├── hooks/        useAsync, useDebounce, useToast, …
│   │   ├── data/         Demo fixtures
│   │   ├── utils/        reportBuilder.js
│   │   ├── App.jsx, main.jsx, index.css
│   ├── public/
│   ├── package.json, vite.config.js, tailwind.config.js
│   └── README.md
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/       One file per resource
│   │   ├── services/     data_service.py, nlp_service.py
│   │   ├── providers/    DemoProvider + Twitter/Reddit/YouTube/News placeholders
│   │   ├── schemas/      Pydantic models
│   │   └── data/         Bundled demo fixtures (JSON)
│   ├── requirements.txt
│   └── README.md
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## Future Improvements

- Implement the Twitter/X, Reddit, YouTube, and News providers against real APIs behind
  the existing `DataProvider` interface.
- Persist a real database (Postgres) instead of static JSON fixtures.
- Swap the deterministic mock summarizer for a live LLM call behind `/api/summarize`.
- Add authentication and per-workspace competitor/influencer tracking lists.
- Scheduled data refresh jobs instead of on-demand generation.

## Author

Built by Megha as a portfolio project demonstrating full-stack, NLP, and product-design
skills applied to a real competitive-intelligence use case.

## Git & GitHub

```bash
git init
git add .
git commit -m "Initial commit - TrendMoni"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Do **not** commit: `node_modules/`, `venv/`, `.env`, `__pycache__/` — all already covered by
`.gitignore`.


