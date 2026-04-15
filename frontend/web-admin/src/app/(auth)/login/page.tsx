"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, ShieldAlert, Code2 } from "lucide-react";

type UserRole = "admin" | "inventory" | "sales" | "finance" | "legal" | "supervisor";

const DEV_ACCOUNTS = [
  { label: "Admin / Direktur", email: "admin@simdp.dev", password: "Admin@123", role: "admin" as UserRole, redirectTo: "/crm" },
  { label: "Admin Inventory", email: "inventory@simdp.dev", password: "Inventory@123", role: "inventory" as UserRole, redirectTo: "/inventory" },
  { label: "Sales & Marketing", email: "sales@simdp.dev", password: "Sales@123", role: "sales" as UserRole, redirectTo: "/sales" },
  { label: "Finance & Accounting", email: "finance@simdp.dev", password: "Finance@123", role: "finance" as UserRole, redirectTo: "/finance" },
  { label: "Tim Legal", email: "legal@simdp.dev", password: "Legal@123", role: "legal" as UserRole, redirectTo: "/legal" },
  { label: "Pengawas Lapangan", email: "supervisor@simdp.dev", password: "Supervisor@123", role: "supervisor" as UserRole, redirectTo: "/supervisor" },
];

const DEFAULT_REDIRECT = "/crm";
const DEFAULT_ROLE: UserRole = "admin";

export default function App() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<"idle" | "loading" | "success">("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberSession, setRememberSession] = useState(false);
  const [showDevMode, setShowDevMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getAccountByEmail = (emailValue: string) => {
    return DEV_ACCOUNTS.find((item) => item.email.toLowerCase() === emailValue.trim().toLowerCase());
  };

  const getRoleRedirect = (emailValue: string) => {
    const account = getAccountByEmail(emailValue);
    return account?.redirectTo ?? DEFAULT_REDIRECT;
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginState("loading");
    const matchedAccount = getAccountByEmail(email);
    const resolvedRole: UserRole = matchedAccount?.role ?? DEFAULT_ROLE;
    const targetRoute = getRoleRedirect(email);

    window.setTimeout(() => {
      setLoginState("success");

      window.setTimeout(() => {
        const authPayload = JSON.stringify({
          email: email.trim(),
          role: resolvedRole,
          redirectTo: targetRoute,
          loginAt: Date.now(),
        });

        try {
          if (rememberSession) {
            localStorage.setItem("simdp_auth", authPayload);
            sessionStorage.removeItem("simdp_auth");
            document.cookie = `simdp_role=${resolvedRole}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
            document.cookie = `simdp_email=${encodeURIComponent(email.trim())}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
          } else {
            sessionStorage.setItem("simdp_auth", authPayload);
            localStorage.removeItem("simdp_auth");
            document.cookie = `simdp_role=${resolvedRole}; path=/; samesite=lax`;
            document.cookie = `simdp_email=${encodeURIComponent(email.trim())}; path=/; samesite=lax`;
          }
        } catch {
          // Ignore storage errors in preview mode.
        }

        router.push(targetRoute);
        setLoginState("idle");
      }, 1800);
    }, 2200);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-zinc-950 font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 scale-105 animate-[pulse_20s_ease-in-out_infinite] opacity-40">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Corporate Building"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/80 to-zinc-950" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      </div>

      <div
        className={`relative z-10 w-full max-w-md px-6 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-24 scale-95"
        }`}
      >
        <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center justify-center text-center mb-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-amber-500 blur-lg opacity-20 rounded-full animate-pulse" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 flex items-center justify-center rounded-2xl transform rotate-45 shadow-xl">
                <span className="font-serif font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-600 transform -rotate-45">
                  G
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-serif text-white mb-2">Griya Persada ERP</h1>
            <p className="text-zinc-400 text-sm font-light">Sistem Manajemen Operasional Terpadu</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type="email"
                required
                disabled={loginState !== "idle"}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900/80 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-zinc-600 font-light disabled:opacity-50"
                placeholder="ID Karyawan / Email"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={loginState !== "idle"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900/80 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-zinc-600 font-light disabled:opacity-50"
                placeholder="Kata Sandi"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                disabled={loginState !== "idle"}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative w-4 h-4 rounded-sm border border-zinc-600 group-hover:border-amber-500 flex items-center justify-center transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(event) => setRememberSession(event.target.checked)}
                    className="absolute opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-2 h-2 bg-amber-500 rounded-sm opacity-0 group-hover:opacity-30 transition-opacity" />
                </div>
                <span className="text-xs text-zinc-400 font-light">Ingat Sesi Ini</span>
              </label>
              <button
                type="button"
                onClick={() => setShowDevMode(!showDevMode)}
                className="text-[10px] inline-flex items-center gap-1 px-2 py-1 rounded border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-zinc-800 transition-colors"
              >
                <Code2 size={12} /> Dev
              </button>
            </div>

            <button
              type="submit"
              disabled={loginState !== "idle"}
              className={`relative w-full h-14 mt-6 rounded-xl overflow-hidden flex justify-center items-center gap-3 text-sm font-semibold tracking-widest uppercase transition-all duration-500 ${
                loginState === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  : "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 shadow-[0_10px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_10px_30px_rgba(245,158,11,0.4)]"
              }`}
            >
              {loginState === "loading" ? (
                <div className="flex items-center gap-3">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>MENGOTENTIKASI...</span>
                </div>
              ) : loginState === "success" ? (
                <div className="flex items-center gap-2 animate-[pulse_1s_ease-in-out_infinite]">
                  <CheckCircle2 size={20} />
                  <span>AKSES DIBERIKAN</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <span>MASUK PORTAL</span>
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {showDevMode && (
            <div className="mt-6 p-3 rounded-xl border border-amber-500/30 bg-zinc-950/50 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300 mb-2">Dev Mode - Cepat Login</p>
              <div className="grid grid-cols-2 gap-2">
                {DEV_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                      setShowDevMode(false);
                    }}
                    className="text-[11px] px-2 py-1.5 rounded border border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-amber-500/40 hover:bg-zinc-800 transition-colors truncate"
                  >
                    {account.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-zinc-500 text-xs font-light px-2 text-center">
          <ShieldAlert size={14} className="text-amber-600/70 shrink-0" />
          <span>Akses Terbatas Internal. Dilindungi Enkripsi 256-bit.</span>
        </div>
      </div>
    </div>
  );
}
