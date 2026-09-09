import { useState } from "react";
import { Menu, Search, RefreshCw, Bell, ChevronDown } from "lucide-react";
import GlobalSearch from "../components/GlobalSearch.jsx";
import { useAppContext } from "../hooks/useAppContext.js";
import { DATE_RANGES } from "../hooks/useAppContext.js";
import { useToast } from "../hooks/useToast.js";

export default function TopNavbar({ onMenuClick }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { dateRange, setDateRange, dateRangeMeta } = useAppContext();
  const toast = useToast();

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Data refreshed");
    }, 700);
  }

  const notifications = [
    { id: 1, text: "NovaTech posting frequency spiked +31% this week." },
    { id: 2, text: "AI Agents crossed the Emerging → Rising threshold." },
    { id: 3, text: "Weekly Competitive Report is ready to view." },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-ink-100 bg-white/85 backdrop-blur flex items-center gap-3 px-4 sm:px-6">
      <button className="lg:hidden text-ink-500 hover:text-ink-800" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <button
        onClick={() => setSearchOpen(true)}
        className="hidden sm:flex items-center gap-2.5 text-sm text-ink-400 bg-ink-50 border border-ink-100 rounded-lg px-3.5 py-2 w-72 hover:border-ink-200 transition-colors"
      >
        <Search size={15} />
        Search competitors, influencers, topics…
        <kbd className="ml-auto text-[10px] font-sans bg-white border border-ink-200 rounded px-1.5 py-0.5 text-ink-400">
          ⌘K
        </kbd>
      </button>
      <button
        onClick={() => setSearchOpen(true)}
        className="sm:hidden text-ink-500 hover:text-ink-800"
        aria-label="Search"
      >
        <Search size={20} />
      </button>

      <div className="flex-1" />

      <div className="relative hidden md:block">
        <button
          onClick={() => setRangeOpen((v) => !v)}
          onBlur={() => setTimeout(() => setRangeOpen(false), 120)}
          className="flex items-center gap-2 text-sm font-medium text-ink-700 border border-ink-200 rounded-lg px-3 py-2 hover:bg-ink-50"
        >
          {dateRangeMeta.label}
          <ChevronDown size={14} className="text-ink-400" />
        </button>
        {rangeOpen && (
          <div className="absolute right-0 mt-1.5 w-44 surface-card shadow-popover py-1 z-40">
            {DATE_RANGES.map((r) => (
              <button
                key={r.key}
                onMouseDown={() => setDateRange(r.key)}
                className={`w-full text-left px-3.5 py-2 text-sm hover:bg-ink-50 ${
                  r.key === dateRange ? "text-signal-600 font-medium" : "text-ink-700"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleRefresh} className="btn-secondary !px-3" aria-label="Refresh data">
        <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
        <span className="hidden sm:inline">Refresh</span>
      </button>

      <div className="relative">
        <button
          onClick={() => setNotifOpen((v) => !v)}
          onBlur={() => setTimeout(() => setNotifOpen(false), 120)}
          className="relative text-ink-500 hover:text-ink-800 p-2 rounded-lg hover:bg-ink-50"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
        {notifOpen && (
          <div className="absolute right-0 mt-1.5 w-72 surface-card shadow-popover py-1 z-40">
            <p className="text-xs font-semibold text-ink-400 px-3.5 py-2 uppercase tracking-wide">Notifications</p>
            {notifications.map((n) => (
              <div key={n.id} className="px-3.5 py-2.5 text-sm text-ink-700 hover:bg-ink-50 border-t border-ink-50">
                {n.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-signal-500 to-signal2-500 text-white flex items-center justify-center text-xs font-semibold shrink-0">
        MG
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
