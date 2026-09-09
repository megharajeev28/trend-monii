import { Search, X } from "lucide-react";

/**
 * Generic, controlled filter bar. `filters` is an array of
 * { key, label, options: string[] } and the parent owns the state via
 * `values` / `onChange`, so every control here actually filters something.
 */
export default function FilterBar({ search, onSearchChange, searchPlaceholder = "Search…", filters = [], values = {}, onChange, onReset }) {
  const hasActiveFilters = search || Object.values(values).some((v) => v && v !== "All");

  return (
    <div className="surface-card p-3 flex flex-wrap items-center gap-2.5 mb-5">
      <div className="flex items-center gap-2 bg-ink-50 border border-ink-100 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
        <Search size={15} className="text-ink-400 shrink-0" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="bg-transparent outline-none text-sm w-full placeholder:text-ink-300"
          aria-label={searchPlaceholder}
        />
      </div>

      {filters.map((f) => (
        <select
          key={f.key}
          value={values[f.key] || "All"}
          onChange={(e) => onChange(f.key, e.target.value)}
          className="text-sm border border-ink-200 rounded-lg px-3 py-2 bg-white text-ink-700 outline-none hover:border-ink-300 focus-visible:ring-2 focus-visible:ring-signal-300"
          aria-label={f.label}
        >
          <option value="All">{f.label}: All</option>
          {f.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ))}

      {hasActiveFilters && onReset && (
        <button onClick={onReset} className="btn-ghost text-xs">
          <X size={13} />
          Clear
        </button>
      )}
    </div>
  );
}
