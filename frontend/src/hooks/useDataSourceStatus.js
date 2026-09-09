import { useEffect, useState } from "react";
import { getDataSourceStatus, onDataSourceStatusChange } from "../services/api.js";

/** Tracks whether the app is serving "demo" or "live" data, updating in real time. */
export function useDataSourceStatus() {
  const [status, setStatus] = useState(getDataSourceStatus());
  useEffect(() => onDataSourceStatusChange(setStatus), []);
  return status;
}
