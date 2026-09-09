import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ToastProvider.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import { SkeletonCard } from "./components/Skeleton.jsx";

const Landing = lazy(() => import("./pages/Landing.jsx"));
const Overview = lazy(() => import("./pages/Overview.jsx"));
const Competitors = lazy(() => import("./pages/Competitors.jsx"));
const CompetitorDetail = lazy(() => import("./pages/CompetitorDetail.jsx"));
const Influencers = lazy(() => import("./pages/Influencers.jsx"));
const InfluencerDetail = lazy(() => import("./pages/InfluencerDetail.jsx"));
const Trends = lazy(() => import("./pages/Trends.jsx"));
const Sentiment = lazy(() => import("./pages/Sentiment.jsx"));
const Content = lazy(() => import("./pages/Content.jsx"));
const Reports = lazy(() => import("./pages/Reports.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function PageFallback() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Suspense fallback={<div className="p-8"><PageFallback /></div>}>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="competitors" element={<Competitors />} />
            <Route path="competitors/:id" element={<CompetitorDetail />} />
            <Route path="influencers" element={<Influencers />} />
            <Route path="influencers/:id" element={<InfluencerDetail />} />
            <Route path="trends" element={<Trends />} />
            <Route path="sentiment" element={<Sentiment />} />
            <Route path="content" element={<Content />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ToastProvider>
  );
}
