import Revealer from '@/components/Revealer';

type Section = { title: string; body: string };

export default function LegalPageLayout({
  kicker,
  title,
  intro,
  sections,
  disclaimer,
}: {
  kicker: string;
  title: string;
  intro: string;
  sections: Section[];
  disclaimer?: string;
}) {
  return (
    <main className="pt-32">
      <section className="container-lux max-w-5xl">
        <Revealer>
          <p className="kicker">{kicker}</p>
          <h1 className="h1 mt-5">{title}</h1>
          <p className="body mt-6 max-w-xl">{intro}</p>
          {disclaimer && (
            <p className="mt-6 border-l border-[var(--gold)]/40 pl-4 text-sm text-white/45">{disclaimer}</p>
          )}
        </Revealer>
        <div className="mt-14 border-t border-white/10">
          {sections.map((s, i) => (
            <section key={s.title} className="border-b border-white/10 py-12">
              <p className="text-sm text-[var(--gold)]">{String(i + 1).padStart(2, '0')}</p>
              <h2 className="serif mt-4 text-4xl">{s.title}</h2>
              <p className="body mt-5 max-w-2xl">{s.body}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
