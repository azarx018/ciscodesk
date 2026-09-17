import { useCallback, useEffect, useState } from "react";

interface UseAsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic data-fetching hook used by every Phase 4 page to call into
 * a mock service: Page → Hook → Mock Service → Mock Data (§22).
 * `deps` follows the same rules as useEffect's dependency array.
 */
export function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[]): UseAsyncResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || "Request failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  return { data, loading, error, refetch };
}
