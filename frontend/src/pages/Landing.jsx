import { Link } from "react-router-dom";
import {
  ArrowRight,
  Swords,
  Users,
  TrendingUp,
  SmilePlus,
  FileSearch,
  Sparkles,
  ArrowDown,
  Radio,
} from "lucide-react";

const FEATURES = [
  {
    icon: Swords,
    title: "Competitor Intelligence",
    description: "Track posting cadence, engagement, and sentiment across every competitor you care about.",
  },
  {
    icon: Users,
    title: "Influencer Discovery",
    description: "Surface rising creators before they peak, ranked by an influence score that blends reach and engagement.",
  },
  {
    icon: TrendingUp,
    title: "Trend Detection",
    description: "Spot emerging topics early with momentum scoring, not just raw mention counts.",
  },
  {
    icon: SmilePlus,
    title: "Sentiment Analysis",
    description: "Understand how audiences feel about specific topics, competitors, and campaigns — not just volume.",
  },
  {
    icon: FileSearch,
    title: "Content Intelligence",
    description: "See which formats and categories actually drive engagement, backed by post-level data.",
  },
  {
    icon: Sparkles,
    title: "AI Summaries",
    description: "Turn a wall of metrics into a plain-language brief with recommended next actions.",
  },
];

const PIPELINE = ["Raw Social Data", "NLP Processing", "Trend Detection", "AI Analysis", "Actionable Insights"];

export default function Landing() {
  return (
    <div className="bg-white text-ink-900">
      <header className="border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-signal-500 to-signal2-500 flex items-center justify-center text-white text-sm font-bold">
              T
            </span>
            TrendMoni
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-400/10 rounded-full px-2.5 py-1">
              <Radio size={11} />
              Demo Data
            </span>
            <Link to="/app/overview" className="btn-primary text-sm">
              Explore Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.08] text-ink-950">
            Turn social signals into competitive intelligence
          </h1>
          <p className="text-lg text-ink-500 mt-5 max-w-lg leading-relaxed">
            Monitor competitors, discover rising influencers, detect emerging trends, and turn unstructured
            social data into actionable business insights.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Link to="/app/overview" className="btn-primary">
              Explore Dashboard
              <ArrowRight size={16} />
            </Link>
            <Link to="/app/overview" className="btn-secondary">
              View Demo
            </Link>
          </div>
          <p className="text-xs text-ink-400 mt-4">No sign-up required — runs entirely on simulated demo data.</p>
        </div>

        <HeroPreview />
      </section>

      {/* Why TrendMoni */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-ink-100">
        <div className="max-w-xl mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink-950">Why TrendMoni?</h2>
          <p className="text-ink-500 mt-2">
            Six focused capabilities that replace hours of manual scrolling with a single, structured view.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="surface-card p-5 hover:border-ink-200 transition-colors">
              <span className="h-10 w-10 rounded-lg bg-signal-50 text-signal-600 flex items-center justify-center mb-3.5">
                <f.icon size={18} />
              </span>
              <h3 className="font-semibold text-ink-900 text-sm">{f.title}</h3>
              <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-ink-100">
        <div className="max-w-xl mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink-950">
            From raw data to business decisions
          </h2>
          <p className="text-ink-500 mt-2">
            Every insight on the dashboard traces back through the same pipeline — nothing is hand-written.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-2">
          {PIPELINE.map((step, idx) => (
            <div key={step} className="flex items-center gap-2 w-full lg:w-auto">
              <div className="surface-card px-5 py-3.5 text-sm font-medium text-ink-800 flex-1 lg:flex-none text-center">
                {step}
              </div>
              {idx < PIPELINE.length - 1 && (
                <ArrowDown size={16} className="text-ink-300 lg:-rotate-90 shrink-0 mx-auto" />
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink-100">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-400">
          <p>TrendMoni — a portfolio project. All data shown is simulated demo data.</p>
          <Link to="/app/overview" className="text-signal-600 font-medium hover:text-signal-700">
            Open the dashboard →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="surface-card p-4 shadow-popover">
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-xs font-semibold text-ink-400">Overview</p>
        <span className="text-[11px] font-medium text-amber-500 bg-amber-400/10 rounded-full px-2 py-0.5">Demo</span>
      </div>
      <div className="grid grid-cols-3 gap-2.5 mb-3">
        {[
          { label: "Mentions", value: "12.8K", change: "+18.4%" },
          { label: "Engagement", value: "486K", change: "+9.2%" },
          { label: "Sentiment", value: "78%", change: "+3.1%" },
        ].map((k) => (
          <div key={k.label} className="rounded-lg bg-ink-50 border border-ink-100 p-3">
            <p className="text-[11px] text-ink-400">{k.label}</p>
            <p className="font-display text-lg font-semibold text-ink-950 mt-0.5">{k.value}</p>
            <p className="text-[11px] text-signal2-600 font-medium mt-0.5">{k.change}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-ink-50 border border-ink-100 p-3 h-32 flex items-end gap-1.5">
        {[40, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 92].map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-signal-500 to-signal-300" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-ink-100 p-3 flex items-start gap-2.5">
        <span className="h-7 w-7 rounded-md bg-signal-50 text-signal-600 flex items-center justify-center shrink-0">
          <Sparkles size={13} />
        </span>
        <p className="text-xs text-ink-600 leading-relaxed">
          <span className="font-medium text-ink-900">AI Agents</span> is the fastest-growing tracked topic this week.
        </p>
      </div>
    </div>
  );
}
