"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import { PortalShell } from "../../../components/PortalShell";
import { apiRequest } from "../../../lib/api-client";
import { useAuthGuard } from "../../../lib/use-auth-guard";

type Ticket = {
  id: string;
  category: string;
  subject: string;
  status: string;
};

type Message = {
  id: string;
  message: string;
  createdAt: string;
  sender: {
    fullName: string;
    role: string;
  };
};

export default function TiketPage() {
  const { auth, loading } = useAuthGuard();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const loadTickets = useCallback(async () => {
    try {
      const data = await apiRequest<Ticket[]>("/portal/tickets");
      setTickets(data);
      if (data[0] && !selectedTicket) {
        setSelectedTicket(data[0].id);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat tiket");
    }
  }, [selectedTicket]);

  const loadMessages = useCallback(async (ticketId: string) => {
    if (!ticketId) {
      return;
    }

    try {
      const data = await apiRequest<Message[]>(`/portal/tickets/${ticketId}/messages`);
      setMessages(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat percakapan tiket");
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      return;
    }
    loadTickets();
  }, [auth, loadTickets]);

  useEffect(() => {
    loadMessages(selectedTicket);
  }, [selectedTicket, loadMessages]);

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await apiRequest("/portal/tickets", {
        method: "POST",
        body: JSON.stringify({
          category: String(formData.get("category") ?? ""),
          subject: String(formData.get("subject") ?? ""),
          description: String(formData.get("description") ?? "")
        })
      });
      event.currentTarget.reset();
      await loadTickets();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal membuat tiket");
    }
  }

  async function replyTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTicket) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
      await apiRequest(`/portal/tickets/${selectedTicket}/messages`, {
        method: "POST",
        body: JSON.stringify({
          message: String(formData.get("message") ?? "")
        })
      });
      event.currentTarget.reset();
      await loadMessages(selectedTicket);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengirim balasan");
    }
  }

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <PortalShell user={auth.user} title="Bantuan & Tiket" subtitle="Ajukan komplain dan pantau progres penanganan secara transparan.">
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

      <div className="grid-2">
        <article className="card">
          <h3>Buat Tiket Baru</h3>
          <form className="inline-form" onSubmit={createTicket}>
            <select name="category" defaultValue="Progres">
              <option value="Progres">Progres</option>
              <option value="Kualitas">Kualitas</option>
              <option value="Dokumen">Dokumen</option>
              <option value="Tagihan">Tagihan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <input name="subject" placeholder="Subjek komplain" required />
            <textarea name="description" rows={4} placeholder="Jelaskan kendala Anda" required />
            <button type="submit">Kirim Tiket</button>
          </form>
        </article>

        <article className="card">
          <h3>Daftar Tiket</h3>
          <div className="inline-form">
            <select value={selectedTicket} onChange={(event) => setSelectedTicket(event.target.value)}>
              <option value="">Pilih tiket</option>
              {tickets.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.subject} ({ticket.status})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "0.7rem", display: "grid", gap: "0.5rem", maxHeight: "260px", overflow: "auto" }}>
            {messages.map((message) => (
              <div className="card" key={message.id}>
                <strong>
                  {message.sender.fullName} - {message.sender.role}
                </strong>
                <p>{message.message}</p>
                <small>{new Date(message.createdAt).toLocaleString("id-ID")}</small>
              </div>
            ))}
            {messages.length === 0 ? <small className="muted">Belum ada percakapan.</small> : null}
          </div>

          <form className="inline-form" style={{ marginTop: "0.8rem" }} onSubmit={replyTicket}>
            <textarea name="message" rows={3} placeholder="Tulis balasan" required />
            <button type="submit">Kirim Balasan</button>
          </form>
        </article>
      </div>
    </PortalShell>
  );
}
