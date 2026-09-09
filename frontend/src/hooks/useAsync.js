import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Runs an async fetcher on mount (and whenever `deps` changes), exposing a
 * consistent { data, loading, error, refetch } shape so every page renders the
 * same loading / error / empty states instead of ad-hoc booleans.
 */
export function useAsync(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (mounted.current) setData(result);
    } catch (err) {
      if (mounted.current) setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mounted.current = true;
    run();
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return { data, loading, error, refetch: run };
}
