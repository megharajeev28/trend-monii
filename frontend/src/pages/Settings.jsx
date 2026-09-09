import { useState } from "react";
import { Info, Radio } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { useToast } from "../hooks/useToast.js";

export default function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [sentimentAlerts, setSentimentAlerts] = useState(false);
  const toast = useToast();

  const apiUrl = import.meta.env.VITE_API_URL || "";

  function save() {
    toast.success("Preferences saved");
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your workspace preferences and data source." />

      <div className="surface-card p-5 mb-5">
        <h2 className="font-semibold text-ink-900 text-sm mb-1">Data source</h2>
        <p className="text-sm text-ink-500 mb-4">
          TrendMoni automatically falls back to demo data whenever a live backend isn't reachable.
        </p>
        <div className="flex items-center gap-3 rounded-lg bg-ink-50 border border-ink-100 px-4 py-3">
          <Radio size={16} className="text-amber-500" />
          <div className="text-sm">
            <p className="font-medium text-ink-800">Demo Data</p>
            <p className="text-ink-500 text-xs mt-0.5">
              {apiUrl ? `Configured backend: ${apiUrl}` : "No VITE_API_URL configured — running fully on local demo data."}
            </p>
          </div>
        </div>
        <p className="text-xs text-ink-400 mt-3 flex items-start gap-1.5">
          <Info size={13} className="mt-0.5 shrink-0" />
          Replace the data providers in <code className="text-ink-500">backend/app/providers</code> with production
          social APIs to enable live monitoring.
        </p>
      </div>

      <div className="surface-card p-5 mb-5">
        <h2 className="font-semibold text-ink-900 text-sm mb-4">Notifications</h2>
        <div className="flex flex-col gap-4">
          <ToggleRow label="Email alerts" description="Get notified for high-impact insights." checked={emailAlerts} onChange={setEmailAlerts} />
          <ToggleRow label="Weekly digest" description="A Monday summary of competitive activity." checked={weeklyDigest} onChange={setWeeklyDigest} />
          <ToggleRow label="Sentiment alerts" description="Notify on sharp negative-sentiment swings." checked={sentimentAlerts} onChange={setSentimentAlerts} />
        </div>
      </div>

      <button className="btn-primary" onClick={save}>
        Save preferences
      </button>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-ink-800">{label}</p>
        <p className="text-xs text-ink-400">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors shrink-0 ${
          checked ? "bg-signal-500 justify-end" : "bg-ink-200 justify-start"
        }`}
      >
        <span className="h-5 w-5 rounded-full bg-white shadow" />
      </button>
    </div>
  );
}
