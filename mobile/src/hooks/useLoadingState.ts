import { useState, useCallback } from "react";

type BannerType = "error" | "success" | "warning" | "info";

interface Banner {
  type: BannerType;
  message: string;
}

interface UseLoadingStateReturn {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  banner: Banner | null;
  setBanner: (banner: Banner | null) => void;
  clearBanner: () => void;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T | undefined>;
}

export function useLoadingState(initialLoading = false): UseLoadingStateReturn {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const clearBanner = useCallback(() => setBanner(null), []);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
      setIsLoading(true);
      clearBanner();
      try {
        return await fn();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan. Coba lagi.";
        setBanner({ type: "error", message });
        setErrorMessage(message);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [clearBanner]
  );

  return {
    isLoading,
    setIsLoading,
    banner,
    setBanner,
    clearBanner,
    errorMessage,
    setErrorMessage,
    withLoading,
  };
}