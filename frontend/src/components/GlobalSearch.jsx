import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Swords, Users, TrendingUp, Hash, Loader2 } from "lucide-react";
import { globalSearch } from "../services/api.js";
import { useDebounce } from "../hooks/useDebounce.js";

const TYPE_ICON = { Competitor: Swords, Influencer: Users, Trend: TrendingUp, Topic: Hash };
const TYPE_ROUTE = {
  Competitor: (id) => `/app/competitors/${id}`,
  Influencer: (id) => `/app/influencers/${id}`,
  Trend: () => `/app/trends`,
  Topic: () => `/app/trends`,
};

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 200);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      return;
    }
    let active = true;
    setLoading(true);
    globalSearch(debounced).then((res) => {
      if (active) {
        setResults(res);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [debounced]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4 bg-ink-950/40" onClick={onClose}>
      <div
        className="w-full max-w-xl surface-card shadow-popover overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Global search"
      >
        <div className="flex items-center gap-3 px-4 border-b border-ink-100">
          {loading ? (
            <Loader2 size={18} className="text-ink-400 animate-spin" />
          ) : (
            <Search size={18} className="text-ink-400" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search competitors, influencers, topics…"
            className="flex-1 py-3.5 bg-transparent outline-none text-sm placeholder:text-ink-300"
            aria-label="Search"
          />
          <button onClick={onClose} className="text-ink-300 hover:text-ink-600" aria-label="Close search">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto py-1">
          {query && !loading && results.length === 0 && (
            <p className="text-sm text-ink-400 px-4 py-6 text-center">No matches for "{query}"</p>
          )}
          {results.map((r, idx) => {
            const Icon = TYPE_ICON[r.type] || Hash;
            return (
              <button
                key={`${r.type}-${r.id}-${idx}`}
                onClick={() => {
                  navigate(TYPE_ROUTE[r.type](r.id));
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-ink-50 text-left"
              >
                <span className="h-8 w-8 rounded-lg bg-ink-50 flex items-center justify-center text-ink-500 shrink-0">
                  <Icon size={15} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-ink-800 truncate">{r.name}</span>
                  <span className="block text-xs text-ink-400">{r.metric}</span>
                </span>
                <span className="text-[11px] uppercase tracking-wide text-ink-300">{r.type}</span>
              </button>
            );
          })}
          {!query && (
            <p className="text-sm text-ink-400 px-4 py-6 text-center">
              Try "AI", "NovaTech", or "Maya Sharma"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
