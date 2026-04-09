import type { AuthState } from "../types";

const API_URL = "http://localhost:4000";

export async function login(email: string, password: string): Promise<AuthState> {
  const response = await fetch(`${API_URL}/auth/login`, {
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
        fullName: string;
        email: string;
        role: "SITE_ENGINEER" | "PROJECT_MANAGER";
      };
    };
  };

  if (!["SITE_ENGINEER", "PROJECT_MANAGER"].includes(body.data.user.role)) {
    throw new Error("Akun ini tidak memiliki akses mobile lapangan");
  }

  return body.data;
}

export async function authRequest<T>(auth: AuthState, path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
      ...(options?.headers ?? {})
    }
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "Request gagal");
  }

  const body = (await response.json()) as { data: T };
  return body.data;
}
