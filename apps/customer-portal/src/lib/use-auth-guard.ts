"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { clearAuthState, getAuthState } from "./auth-storage";
import type { CustomerAuthState } from "./types";

export function useAuthGuard() {
  const [auth, setAuth] = useState<CustomerAuthState | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const current = getAuthState();

    if (!current || current.user.role !== "CUSTOMER") {
      clearAuthState();
      setLoading(false);
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setAuth(current);
    setLoading(false);
  }, [pathname, router]);

  return useMemo(
    () => ({
      auth,
      loading,
      isAuthenticated: Boolean(auth)
    }),
    [auth, loading]
  );
}
