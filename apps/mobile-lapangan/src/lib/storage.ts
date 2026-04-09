import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AuthState, PendingQueueItem } from "../types";

const AUTH_KEY = "simdp_mobile_lapangan_auth";
const QUEUE_KEY = "simdp_mobile_lapangan_queue";

export async function getAuth(): Promise<AuthState | null> {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
}

export async function setAuth(auth: AuthState): Promise<void> {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export async function clearAuth(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}

export async function getQueue(): Promise<PendingQueueItem[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as PendingQueueItem[];
  } catch {
    return [];
  }
}

export async function setQueue(items: PendingQueueItem[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}
