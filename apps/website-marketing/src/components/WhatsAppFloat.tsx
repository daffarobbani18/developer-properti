export function WhatsAppFloat() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890";

  return (
    <a
      className="wa-float"
      href={`https://wa.me/${wa}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Hubungi via WhatsApp"
    >
      WA Sales
    </a>
  );
}
