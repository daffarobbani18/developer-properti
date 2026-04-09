import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { login } from "../services/api";
import { clearStoredAuth, getStoredAuth, setStoredAuth } from "../services/storage";
import { AuthState } from "../types";

type AuthContextValue = {
  auth: AuthState | null;
  isBootstrapping: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  setSession: (authState: AuthState) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const storedAuth = await getStoredAuth();
        if (mounted) {
          setAuth(storedAuth);
        }
      } finally {
        if (mounted) {
          setIsBootstrapping(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      isBootstrapping,
      signIn: async (email, password) => {
        const result = await login(email, password);
        await setStoredAuth(result);
        setAuth(result);
      },
      setSession: async (authState) => {
        await setStoredAuth(authState);
        setAuth(authState);
      },
      signOut: async () => {
        await clearStoredAuth();
        setAuth(null);
      },
    }),
    [auth, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai dalam AuthProvider");
  }
  return context;
}
