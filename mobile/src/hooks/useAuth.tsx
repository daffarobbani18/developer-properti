import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppState, DeviceEventEmitter } from "react-native";

import { login, registerPushToken } from "../services/api";
import {
  clearAuthInactiveAt,
  clearStoredAuth,
  getAuthInactiveAt,
  getStoredAuth,
  setAuthInactiveAt,
  setStoredAuth,
} from "../services/storage";
import { AuthState } from "../types";
import Constants from "expo-constants";
import { Platform } from "react-native";

async function registerForPushNotificationsAsync(): Promise<string | null> {
  const appOwnership = (Constants as any).appOwnership as string | null;
  if (appOwnership === 'expo') {
    console.log('[Notifications] Skipping push token registration in Expo Go (not supported since SDK 53)');
    return null;
  }

  let Notifications: any;
  try {
    Notifications = require("expo-notifications");
  } catch (e) {
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Push notification permission not granted');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } catch (error) {
    console.error('Failed to register push token:', error);
    return null;
  }
}

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

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("onUnauthorized", async () => {
      if (auth) {
        await clearStoredAuth();
        setAuth(null);
      }
    });
    return () => sub.remove();
  }, [auth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      isBootstrapping,
      signIn: async (email, password) => {
        const result = await login(email, password);
        await setStoredAuth(result);
        setAuth(result);
        
        registerForPushNotificationsAsync().then((token) => {
          if (token) {
            registerPushToken(result, {
              expoPushToken: token,
              platform: Platform.OS as "android" | "ios" | "web",
              appVersion: Constants.expoConfig?.version,
            }).catch(() => {
              console.warn('Failed to register push token to server');
            });
          }
        });
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
