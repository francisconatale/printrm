import { useState, useEffect } from 'react';

export function useBackendHealthCheck(url: string = 'http://localhost:8080/api/health', maxRetries: number = 30) {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: number;

    const checkHealth = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'UP') {
            setIsReady(true);
            setError(null);
            return true;
          }
        }
      } catch (err) {
        console.log('Backend not ready yet, retrying...');
      }
      return false;
    };

    const poll = async () => {
      const ready = await checkHealth();
      if (!ready) {
        setRetryCount(prev => {
          const next = prev + 1;
          if (next > maxRetries) {
            setError("El servidor está tardando demasiado en iniciar. Por favor, reinicia la aplicación.");
          } else {
            timeoutId = window.setTimeout(poll, 1000);
          }
          return next;
        });
      }
    };

    poll();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [url, maxRetries]);

  return { isReady, retryCount, error };
}
