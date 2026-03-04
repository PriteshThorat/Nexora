import { useRef, useCallback } from "react";

/**
 * Hook to deduplicate in-flight API requests
 * Prevents multiple identical requests from being sent simultaneously
 *
 * Usage:
 * const { makeCachedRequest } = useInFlightRequests();
 * const result = await makeCachedRequest('stock-AAPL', fetchFunction);
 */
export const useInFlightRequests = () => {
  const inflightRef = useRef(new Map());

  const makeCachedRequest = useCallback(async <T,>(cacheKey: string, fetchFunction: () => Promise<T>) => {
    // If request already in flight, wait for it instead of making a new one
    if (inflightRef.current.has(cacheKey)) {
      return inflightRef.current.get(cacheKey);
    }

    // Create the promise and store it
    const promise = fetchFunction()
      .then((result: T) => {
        // Clean up after success
        inflightRef.current.delete(cacheKey);
        return result;
      })
      .catch((error: unknown) => {
        // Clean up on error too
        inflightRef.current.delete(cacheKey);
        throw error;
      });

    // Add to in-flight map
    inflightRef.current.set(cacheKey, promise);

    return promise;
  }, []);

  return { makeCachedRequest };
};
