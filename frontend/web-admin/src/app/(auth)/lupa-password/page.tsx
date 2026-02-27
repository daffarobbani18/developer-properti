"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export default function LupaPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email harus diisi.");
      return;
    }

    setIsLoading(true);

    // Simulasi kirim email — nanti diganti API NestJS
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
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
          Lupa Password
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Masukkan email Anda untuk menerima link reset password
        </p>
      </div>

      <Card className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-xl">
        <CardHeader className="pb-0" />
        <CardContent>
          {sent ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 mb-4">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-900 mb-1">
                Email Terkirim
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Kami telah mengirimkan link reset password ke{" "}
                <span className="font-medium text-slate-700">{email}</span>.
                Silakan cek inbox Anda.
              </p>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="rounded-lg border-slate-200/80 hover:bg-white/90 transition-all duration-200"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Login
                </Button>
              </Link>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-rose-50 border border-rose-200/60 px-4 py-3 text-sm text-rose-600">
                  {error}
                </div>
              )}

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-lg border-slate-200/80 bg-white/60 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all duration-200 ease-in-out disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Mengirim...
                  </span>
                ) : (
                  "Kirim Link Reset"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Kembali ke Login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
