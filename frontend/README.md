# TrendMoni (frontend)

A Vite + React + Tailwind SaaS dashboard for competitor, influencer, trend, sentiment, and
content intelligence. Works fully standalone with bundled demo data — no backend required.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build for production

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Connecting a real backend

By default `VITE_API_URL` is unset and the app runs entirely on the demo fixtures in
`src/data/`. To point it at the FastAPI backend (see `../backend`):

```bash
# frontend/.env
VITE_API_URL=http://localhost:8000
```

If the backend is unreachable, `src/services/api.js` automatically falls back to demo data
and the sidebar shows "Backend unavailable — using demo data" instead of crashing.

## Project structure

```
src/
├── components/   Reusable UI: MetricCard, ChartCard, InsightCard, tables, badges, states…
├── layouts/      Sidebar, TopNavbar, DashboardLayout, AppProvider (shared date-range state)
├── pages/        One file per route (Landing, Overview, Competitors, Trends, …)
├── services/     api.js (data-source abstraction) + analytics.js (formatting / AI-style text)
├── hooks/        useAsync, useDebounce, useToast, useDataSourceStatus, useAppContext
├── data/         Demo fixtures: competitors, influencers, trends, posts, sentiment, dashboard
└── utils/        reportBuilder.js — assembles the four Reports-page report types
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Import Project** from the repo.
3. Set **Root Directory** to `frontend`.
4. Build command: `npm run build`. Output directory: `dist`.
5. (Optional) add `VITE_API_URL` as an environment variable if you've deployed the backend.

Demo Mode works with no environment variables set at all — this is the recommended path for
a portfolio deployment.
