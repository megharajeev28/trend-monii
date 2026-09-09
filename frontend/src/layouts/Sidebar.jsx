import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Swords,
  Users,
  TrendingUp,
  SmilePlus,
  FileText,
  Settings,
  Radio,
  Wifi,
  WifiOff,
  X,
  BarChart3,
} from "lucide-react";
import { useDataSourceStatus } from "../hooks/useDataSourceStatus.js";

const NAV_ITEMS = [
  { to: "/app/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/app/competitors", label: "Competitors", icon: Swords },
  { to: "/app/influencers", label: "Influencers", icon: Users },
  { to: "/app/trends", label: "Trends", icon: TrendingUp },
  { to: "/app/sentiment", label: "Sentiment", icon: SmilePlus },
  { to: "/app/content", label: "Content Intelligence", icon: FileText },
  { to: "/app/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const status = useDataSourceStatus();

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink-950/40 lg:hidden"
        />
      )}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 shrink-0 border-r border-ink-100 bg-white flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-ink-100">
          <a href="/" className="flex items-center gap-2 font-display font-semibold text-ink-950 text-lg">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-signal-500 to-signal2-500 flex items-center justify-center text-white text-sm font-bold">
              T
            </span>
            TrendMoni
          </a>
          <button className="lg:hidden text-ink-400 hover:text-ink-700" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1" aria-label="Primary">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => (isActive ? "nav-link-active" : "nav-link")}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-ink-100 flex flex-col gap-1">
          <NavLink to="/app/settings" className={({ isActive }) => (isActive ? "nav-link-active" : "nav-link")}>
            <Settings size={17} />
            Settings
          </NavLink>

          <div className="mt-2 mx-1 rounded-lg bg-ink-50 border border-ink-100 px-3 py-2.5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500">
              <Radio size={13} className="animate-pulse" />
              DEMO MODE
            </div>
            <div className="flex items-center gap-1.5 text-xs text-ink-500">
              {status === "live" ? (
                <>
                  <Wifi size={13} className="text-signal2-500" />
                  API connected
                </>
              ) : status === "checking" ? (
                <>
                  <Wifi size={13} className="text-amber-500" />
                  Checking API…
                </>
              ) : (
                <>
                  <WifiOff size={13} className="text-ink-400" />
                  Backend unavailable — using demo data
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
