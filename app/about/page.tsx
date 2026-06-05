import Image from 'next/image';
import Link from 'next/link';
import Revealer from '@/components/Revealer';
import { img } from '@/lib/data';

const timeline = [
  ['01', 'Source', 'Private collectors, estates, and trusted relationships — never marketplace noise.'],
  ['02', 'Verify', 'Reference, serial, movement, and condition reviewed with documented photography.'],
  ['03', 'Transfer', 'Insured shipping, signature confirmation, and discreet chain of custody.'],
] as const;

export default function About() {
  return (
    <main className="pt-20">
      <section className="about-grid grid min-h-[calc(100vh-5rem)] grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center px-8 py-20 md:px-20">
          <Revealer>
            <p className="kicker">About</p>
            <h1 className="h1 mt-5">
              About
              <br />
              PROVENANCE
            </h1>
            <p className="mt-3 text-sm text-white/50">A Surface Tension Company</p>
            <div className="my-8 h-px w-10 bg-[var(--gold)]" />
            <div className="body max-w-xl space-y-6">
              <p>PROVENANCE exists to connect connoisseurs with objects that carry more than value — they carry history.</p>
              <p>
                We curate rare watches and fine jewelry with verified origin, meticulous documentation, and
                uncompromising standards.
              </p>
              <p>
                Every piece is sourced through collectors, estates, and private relationships. We believe authenticity
                is not optional. It is the product.
              </p>
            </div>
          </Revealer>
        </div>
        <div className="relative min-h-[420px] lg:min-h-[600px]">
          <Image src={img.about} alt="About PROVENANCE" fill className="object-cover object-top opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/40" />
        </div>
      </section>

      <section className="container-lux border-y border-white/10 py-24">
        <Revealer>
          <p className="kicker">Our Standard</p>
          <h2 className="h2 mt-5 max-w-3xl">Verified Origin. Absolute Confidence.</h2>
          <p className="body mt-6 max-w-2xl">
            We do not claim authentication without process. Every verified listing includes condition reporting,
            reference review, and documentation appropriate to the piece.
          </p>
        </Revealer>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            ['Source', 'Private networks and real history.'],
            ['Document', 'Reference, serial, and condition disclosed.'],
            ['Deliver', 'Insured transfer with signature confirmation.'],
          ].map(([t, b]) => (
            <Revealer key={t} className="panel p-8">
              <p className="text-[10px] uppercase tracking-[.24em] text-[var(--gold)]">{t}</p>
              <p className="body mt-4">{b}</p>
            </Revealer>
          ))}
        </div>
      </section>

      <section className="container-lux py-24">
        <Revealer>
          <p className="kicker">Our Process</p>
          <h2 className="h2 mt-5">Source. Verify. Transfer.</h2>
        </Revealer>
        <div className="mt-14 space-y-0 border-t border-white/10">
          {timeline.map(([n, t, b]) => (
            <Revealer key={t} className="grid gap-6 border-b border-white/10 py-10 md:grid-cols-[80px_1fr_2fr]">
              <p className="text-sm text-[var(--gold)]">{n}</p>
              <h3 className="serif text-3xl">{t}</h3>
              <p className="body">{b}</p>
            </Revealer>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image src={img.watches} alt="Watch culture" fill className="object-cover object-top opacity-75" />
          <div className="absolute inset-0 bg-black/35" />
        </div>
        <div className="flex items-center px-8 py-20 md:px-20">
          <Revealer>
            <p className="kicker">Watch culture</p>
            <h2 className="h2 mt-5">Timepieces anchor our catalog.</h2>
            <p className="body mt-6 max-w-lg">
              From sport references to dress classics, we prioritize mechanical integrity, documented provenance, and
              collector-grade presentation.
            </p>
          </Revealer>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="order-2 flex items-center px-8 py-20 md:px-20 lg:order-1">
          <Revealer>
            <p className="kicker">Fine jewelry</p>
            <h2 className="h2 mt-5">Detail that endures.</h2>
            <p className="body mt-6 max-w-lg">
              Stones, settings, and metalwork reviewed with the same rigor as our watch inventory — photographed,
              documented, and transferred with care.
            </p>
          </Revealer>
        </div>
        <div className="relative order-1 min-h-[420px] lg:order-2">
          <Image src={img.jewelry} alt="Fine jewelry" fill className="object-cover object-top opacity-75" />
          <div className="absolute inset-0 bg-black/35" />
        </div>
      </section>

      <section className="container-lux py-28 text-center">
        <Revealer>
          <p className="kicker">Private access</p>
          <h2 className="h2 mx-auto mt-5 max-w-2xl">Join by invitation.</h2>
          <p className="body mx-auto mt-6 max-w-lg">
            Early access to new pieces before they enter the public collection. For serious collectors only.
          </p>
          <Link href="/access" className="btn mx-auto mt-10">
            <span>Request Access</span>
            <span>→</span>
          </Link>
        </Revealer>
      </section>
    </main>
  );
}
