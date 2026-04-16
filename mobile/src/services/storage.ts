import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthState, PendingQueueItem } from "../types";

const AUTH_STORAGE_KEY = "simdp-mobile-auth";
const OFFLINE_QUEUE_KEY = "simdp-mobile-offline-queue";
const AUTH_INACTIVE_AT_KEY = "simdp-mobile-auth-inactive-at";

export async function getStoredAuth(): Promise<AuthState | null> {
  const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export async function setStoredAuth(value: AuthState): Promise<void> {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
}

export async function clearStoredAuth(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function setAuthInactiveAt(value: number): Promise<void> {
  await AsyncStorage.setItem(AUTH_INACTIVE_AT_KEY, String(value));
}

export async function getAuthInactiveAt(): Promise<number | null> {
  const raw = await AsyncStorage.getItem(AUTH_INACTIVE_AT_KEY);
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function clearAuthInactiveAt(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_INACTIVE_AT_KEY);
}

export async function getOfflineQueue(): Promise<PendingQueueItem[]> {
  const raw = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as PendingQueueItem[];
  } catch {
    await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
    return [];
  }
}

export async function setOfflineQueue(queue: PendingQueueItem[]): Promise<void> {
  await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export async function pushOfflineQueue(item: PendingQueueItem): Promise<void> {
  const queue = await getOfflineQueue();
  queue.push(item);
  await setOfflineQueue(queue);
}

export async function clearOfflineQueue(): Promise<void> {
  await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
}
