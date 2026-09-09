import { createContext, useContext } from "react";

export const AppContext = createContext(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within <AppProvider>");
  return ctx;
}

export const DATE_RANGES = [
  { key: "7d", label: "Last 7 Days", days: 7, scale: 1 },
  { key: "30d", label: "Last 30 Days", days: 30, scale: 4.2 },
  { key: "90d", label: "Last 90 Days", days: 90, scale: 12.1 },
];
