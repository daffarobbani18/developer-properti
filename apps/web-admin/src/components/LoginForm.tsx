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
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const auth = await login(email, password);
      setAuthState({ token: auth.token, user: auth.user });
      const next = searchParams.get("next") || "/dashboard";
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
        <input name="email" type="email" placeholder="sales@simdp.local" required />
      </label>
      <label>
        Password
        <input name="password" type="password" placeholder="Password123!" required />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Memproses..." : "Masuk"}
      </button>
      {errorMessage ? <p className="error">{errorMessage}</p> : null}
      <p className="hint">Akun seed tersedia dengan password default: Password123!</p>
    </form>
  );
}
