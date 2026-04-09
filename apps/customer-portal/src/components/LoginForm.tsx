"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { setAuthState } from "../lib/auth-storage";
import { login } from "../lib/api-client";

export function LoginForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const auth = await login(
        String(formData.get("email") ?? ""),
        String(formData.get("password") ?? "")
      );
      setAuthState(auth);
      const next = searchParams.get("next") || "/beranda";
      router.replace(next);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <label>
        Email
        <input name="email" type="email" required placeholder="customer@simdp.local" />
      </label>
      <label>
        Password
        <input name="password" type="password" required placeholder="Password123!" />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Memproses..." : "Masuk ke Portal"}
      </button>
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
    </form>
  );
}
