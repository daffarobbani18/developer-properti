import type { CustomerAuthState } from "./types";

const STORAGE_KEY = "simdp_customer_portal_auth";

export function getAuthState(): CustomerAuthState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CustomerAuthState;
  } catch {
    return null;
  }
}

export function setAuthState(auth: CustomerAuthState): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuthState(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}
