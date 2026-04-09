import { Suspense } from "react";

import { LoginForm } from "../../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Masuk Customer Portal</h1>
        <p className="muted">Gunakan akun pembeli Anda untuk memantau progres unit dan tagihan.</p>
        <Suspense fallback={<p className="muted">Memuat form login...</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
