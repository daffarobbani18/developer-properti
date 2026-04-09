import type { PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<{
  id?: string;
  title: string;
  subtitle?: string;
}>;

export function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="content-section">
      <div className="container">
        <header className="section-head">
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}
