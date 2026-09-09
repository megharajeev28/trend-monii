import { useState } from "react";
import { AppContext, DATE_RANGES } from "../hooks/useAppContext.js";

export default function AppProvider({ children }) {
  const [dateRange, setDateRange] = useState(DATE_RANGES[0].key);

  const value = {
    dateRange,
    setDateRange,
    dateRangeMeta: DATE_RANGES.find((d) => d.key === dateRange) || DATE_RANGES[0],
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
