"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { clearAuthState, getAuthState } from "./auth-storage";
import type { AuthState, Role } from "./types";

export function useAuthGuard(allowedRoles?: Role[]) {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const current = getAuthState();

    if (!current) {
      setLoading(false);
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(current.user.role)) {
      clearAuthState();
      setLoading(false);
      router.replace("/login");
      return;
    }

    setAuth(current);
    setLoading(false);
  }, [allowedRoles, pathname, router]);

  return useMemo(
    () => ({
      auth,
      loading,
      isAuthenticated: Boolean(auth)
    }),
    [auth, loading]
  );
}
