import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Polling hook — calls `fetchFn` immediately then every `interval` ms.
 * Returns { data, loading, error, refetch }.
 */
export function usePolling(fetchFn, interval = 60000, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const timerRef = useRef(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    try {
      const result = await fetchFn();
      if (mountedRef.current) { setData(result); setError(null); }
    } catch (err) {
      if (mountedRef.current) setError(err.message || 'Error');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    fetch();
    timerRef.current = setInterval(fetch, interval);
    return () => {
      mountedRef.current = false;
      clearInterval(timerRef.current);
    };
  }, [fetch, interval]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Simple one-shot data fetch hook.
 */
export function useFetch(fetchFn, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchFn();
      if (mountedRef.current) { setData(result); setError(null); }
    } catch (err) {
      if (mountedRef.current) setError(err.message || 'Error');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => { mountedRef.current = false; };
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
