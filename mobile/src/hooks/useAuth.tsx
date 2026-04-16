import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";

import { login } from "../services/api";
import {
  clearAuthInactiveAt,
  clearStoredAuth,
  getAuthInactiveAt,
  getStoredAuth,
  setAuthInactiveAt,
  setStoredAuth,
} from "../services/storage";
import { AuthState } from "../types";

const AUTO_LOCK_TIMEOUT_MS = 15 * 60 * 1000;

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

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        void setAuthInactiveAt(Date.now());
        return;
      }

      if (nextState === "active") {
        void (async () => {
          const timestamp = await getAuthInactiveAt();
          if (!timestamp) {
            return;
          }

          if (!auth) {
            await clearAuthInactiveAt();
            return;
          }

          if (Date.now() - timestamp >= AUTO_LOCK_TIMEOUT_MS) {
            await clearStoredAuth();
            setAuth(null);
          }

          await clearAuthInactiveAt();
        })();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [auth]);

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
