"use client";

import { useEffect, useState } from "react";

import { PortalShell } from "../../../components/PortalShell";
import { apiRequest } from "../../../lib/api-client";
import { useAuthGuard } from "../../../lib/use-auth-guard";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqPage() {
  const { auth, loading } = useAuthGuard();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!auth) {
      return;
    }

    apiRequest<FaqItem[]>("/portal/faq")
      .then(setFaqs)
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat FAQ");
      });
  }, [auth]);

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <PortalShell user={auth.user} title="FAQ" subtitle="Pertanyaan yang paling sering diajukan pembeli.">
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
      <div className="grid-2">
        {faqs.map((faq) => (
          <article className="card" key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
