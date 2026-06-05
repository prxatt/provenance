'use client';

const items = [
  ['01', 'Authenticity', 'Multi-point verification before any piece is presented.'],
  ['02', 'Documentation', 'Reference, condition, and ownership context disclosed.'],
  ['03', 'Insured Shipping', 'Fully insured transfer with signature confirmation.'],
  ['04', 'Secure Transaction', 'Concierge review for high-value private purchases.'],
] as const;

export default function TrustFooterStrip() {
  return (
    <section className="border-y border-white/10 bg-[#050505]">
      <div className="container-lux grid gap-px bg-white/10 md:grid-cols-4">
        {items.map(([n, t, b]) => (
          <div key={t} className="bg-black px-6 py-10 md:px-8">
            <p className="text-xs text-[var(--gold)]">{n}</p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[.24em] text-white/85">{t}</p>
            <p className="mt-3 text-sm font-light leading-7 text-white/45">{b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
