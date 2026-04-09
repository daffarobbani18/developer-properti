import { getAuthState } from "./auth-storage";
import type { Role } from "./types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const auth = getAuthState();

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      ...(options?.headers ?? {})
    }
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "Terjadi kesalahan pada server");
  }

  const body = (await response.json()) as { data: T };
  return body.data;
}

export async function login(email: string, password: string): Promise<{
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
  };
}> {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "Login gagal");
  }

  const body = (await response.json()) as {
    data: {
      token: string;
      user: {
        id: string;
        email: string;
        fullName: string;
        role: Role;
      };
    };
  };

  return body.data;
}
