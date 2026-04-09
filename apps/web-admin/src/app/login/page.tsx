import { Suspense } from "react";

import { LoginForm } from "../../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>SIMDP Web Admin</h1>
        <p>Masuk menggunakan akun internal sesuai role Anda.</p>
        <Suspense fallback={<p>Memuat form login...</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
