import { useState, useCallback, useEffect, useRef } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const useFetch = <T,>(
  fetcher: () => Promise<T>,
  immediate = true
) => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  // Avoids "Can't perform a state update on an unmounted component"
  // warnings when a request resolves after the consumer has navigated away.
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await fetcher();
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (isMountedRef.current) {
        setState({ data: null, loading: false, error });
      }
    }
  }, [fetcher]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return { ...state, refetch: execute };
};