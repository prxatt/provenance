import Link from 'next/link';
import Image from 'next/image';
import Revealer from '@/components/Revealer';
import TrustStrip from '@/components/TrustStrip';
import ProductCard from '@/components/ProductCard';
import HeroMedia from '@/components/HeroMedia';
import { getProducts, img } from '@/lib/data';

export default async function Home() {
  const products = await getProducts();
  const featured = products.find((p) => p.featured) ?? products[0] ?? null;

  return (
    <main>
      <section className="relative min-h-screen overflow-hidden pt-20">
        <HeroMedia src={img.hero} alt="Cinematic PROVENANCE hero" />
        <div className="container-lux relative z-10 flex min-h-[calc(100vh-5rem)] items-center">
          <Revealer>
            <p className="kicker mb-8">Curated watches & jewelry</p>
            <h1 className="display max-w-3xl">
              Objects
              <br />
              <em className="font-light">with</em>
              <br />
              history.
            </h1>
            <div className="my-8 h-px w-10 bg-[var(--gold)]" />
            <p className="body max-w-sm">
              Some things are worth more after someone else has worn them. Verified origin. Absolute confidence.
            </p>
            <Link href="/collection" className="btn mt-10">
              <span>View Collection</span>
              <span>→</span>
            </Link>
          </Revealer>
        </div>
        <p className="absolute bottom-8 left-8 z-10 text-[10px] uppercase tracking-[.24em] text-white/45">
          Verified origin. Absolute confidence.
        </p>
      </section>

      <TrustStrip />

      {featured ? (
        <section className="container-lux grid min-h-screen items-center gap-16 py-28 lg:grid-cols-2">
          <Revealer>
            <p className="kicker">Featured Piece</p>
            <h2 className="h2 mt-5">
              {featured.brand} {featured.name} — Reference {featured.ref}
            </h2>
            <p className="body mt-8 max-w-xl">{featured.description}</p>
            <div className="mt-8 grid max-w-lg grid-cols-2 gap-px border border-white/10 bg-white/10 text-sm">
              <Spec k="Condition" v={featured.condition} />
              <Spec k="Year" v={String(featured.year)} />
              <Spec k="Material" v={featured.material} />
              <Spec k="Location" v={featured.location} />
            </div>
            <Link href={`/product/${featured.slug}`} className="btn btn-white mt-10">
              <span>View Details</span>
              <span>→</span>
            </Link>
          </Revealer>
          <Revealer delay={0.15} className="relative aspect-[16/12] overflow-hidden border border-white/10 bg-[#050505]">
            <Image src={featured.heroImage} alt={featured.name} fill className="object-cover object-top opacity-90" />
          </Revealer>
        </section>
      ) : (
        <section className="container-lux py-28 text-center">
          <Revealer>
            <p className="kicker">Featured Piece</p>
            <h2 className="h2 mx-auto mt-5 max-w-2xl">New verified inventory arriving soon.</h2>
            <p className="body mx-auto mt-6 max-w-lg">
              The catalog is being prepared. Request private access to hear about pieces first.
            </p>
            <Link href="/access" className="btn mx-auto mt-10">
              <span>Request Access</span>
              <span>→</span>
            </Link>
          </Revealer>
        </section>
      )}

      <section className="relative overflow-hidden py-28">
        <Image src={img.void} alt="Volumetric black transition" fill className="object-cover opacity-45" />
        <div className="container-lux relative">
          <Revealer>
            <p className="kicker">Current Collection</p>
            <h2 className="h1 mt-5 max-w-4xl">A private catalog for serious collectors.</h2>
          </Revealer>
          {products.length > 0 ? (
            <div className="mt-16 grid gap-10 md:grid-cols-3">
              {products.slice(0, 3).map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="panel mx-auto mt-16 max-w-lg p-10 text-center">
              <p className="body">No live inventory at the moment. Layout samples remain visible on the collection page.</p>
              <Link href="/collection" className="btn mx-auto mt-8">
                <span>Browse Collection</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="container-lux grid items-center gap-14 py-28 lg:grid-cols-2">
        <Revealer className="relative min-h-[560px] overflow-hidden border border-white/10">
          <Image src={img.trust} alt="PROVENANCE authentication documents" fill className="object-cover opacity-90" />
        </Revealer>
        <Revealer delay={0.1}>
          <p className="kicker">Provenance</p>
          <h2 className="h2 mt-5">Verified Origin. Absolute Confidence.</h2>
          <p className="body mt-8">
            Every piece is sourced with integrity and documented through reference verification, condition reporting,
            and secure transaction standards.
          </p>
          <Link href="/about" className="btn mt-10">
            <span>Our Standard</span>
            <span>→</span>
          </Link>
        </Revealer>
      </section>

      <section className="container-lux py-28 text-center">
        <p className="kicker">Private Access</p>
        <h2 className="h2 mx-auto mt-5 max-w-3xl">For serious collectors only.</h2>
        <p className="body mx-auto mt-6 max-w-lg">Early access to new pieces before they enter the public collection.</p>
        <Link href="/access" className="btn mx-auto mt-10">
          <span>Request Access</span>
          <span>→</span>
        </Link>
      </section>
    </main>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-black p-5">
      <p className="text-[9px] uppercase tracking-[.22em] text-white/35">{k}</p>
      <p className="mt-2 text-sm text-white/80">{v}</p>
    </div>
  );
}
