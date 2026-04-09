"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email dan password harus diisi.");
      return;
    }

    setIsLoading(true);

    // Simulasi login — nanti diganti API NestJS
    await new Promise((r) => setTimeout(r, 1000));

    // Dummy validation
    if (form.email === "admin@simdp.id" && form.password === "admin123") {
      router.push("/");
    } else {
      setError("Email atau password salah.");
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-[family-name:var(--font-heading)] font-bold text-2xl shadow-lg shadow-blue-600/20">
          S
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-slate-900">
          Masuk ke SIMDP
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Sistem Informasi Manajemen Developer Perumahan
        </p>
      </div>

      {/* Login Card */}
      <Card className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl">
        <CardHeader className="pb-0" />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-200/60 px-4 py-3 text-sm text-rose-600">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@perusahaan.id"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="h-11 rounded-lg border-slate-200/80 bg-white/60 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </Label>
                <Link
                  href="/lupa-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="h-11 rounded-lg border-slate-200/80 bg-white/60 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 pr-11 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all duration-200 ease-in-out disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Memproses...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Masuk
                </span>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg bg-slate-50/80 border border-slate-200/40 px-4 py-3">
            <p className="text-xs font-medium text-slate-500 mb-1">
              Demo Login:
            </p>
            <p className="text-xs text-slate-400">
              Email: <span className="font-mono text-slate-600">admin@simdp.id</span>
            </p>
            <p className="text-xs text-slate-400">
              Password: <span className="font-mono text-slate-600">admin123</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-slate-400">
        SIMDP v1.0 &copy; 2026 — Semua hak dilindungi
      </p>
    </div>
  );
}
