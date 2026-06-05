import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Revealer from '@/components/Revealer';
import ProductFeatureBand from '@/components/ProductFeatureBand';
import ProductStage from '@/components/ProductStage';
import { getProduct, getProducts, money } from '@/lib/data';
import { productGallery, isAvailableSku } from '@/lib/catalog';
import ProductCard from '@/components/ProductCard';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const related = (await getProducts())
    .filter((x) => x.slug !== p.slug && (x.type === p.type || x.category === p.category))
    .slice(0, 3);
  const gallery = productGallery(p);
  const available = isAvailableSku(p);

  return (
    <main className="pt-20">
      <div className="container-lux py-6">
        <Link href="/collection" className="text-[10px] uppercase tracking-[.22em] text-white/45 hover:text-white">
          ← Back to Collection
        </Link>
      </div>

      <section className="product-grid grid min-h-[calc(100vh-5rem)] grid-cols-1 border-b border-white/10 lg:grid-cols-2">
        <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r">
          <ProductStage product={p} images={gallery} />
        </div>

        <div className="px-6 py-12 md:px-10 lg:px-16">
          <Revealer>
            <p className="kicker">{p.tag}</p>
            <h1 className="serif mt-5 text-4xl leading-tight md:text-6xl lg:text-7xl">
              {p.brand} {p.name}
              <br />
              <span className="text-white/70">Reference {p.ref}</span>
            </h1>
            <p className="serif mt-7 text-3xl md:text-4xl">{money(p.price)}</p>
            {available ? (
              <p className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.24em] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Available · Verified origin
              </p>
            ) : (
              p.verified && (
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[.24em] text-white/45">
                  {p.status} · Verified origin
                </p>
              )
            )}
            <div className="my-7 h-px w-10 bg-[var(--gold)]" />
            <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4">
              {[['Condition', p.condition], ['Year', String(p.year)], ['Box & Papers', p.boxPapers], ['Location', p.location]].map(
                ([k, v]) => (
                  <div key={k} className="bg-black p-4">
                    <p className="text-[9px] uppercase tracking-[.2em] text-white/35">{k}</p>
                    <p className="mt-2 text-sm text-white/80">{v}</p>
                  </div>
                ),
              )}
            </div>
            <p className="body mt-8 max-w-2xl">{p.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {available ? (
                <Link className="btn" href={`/checkout/${p.slug}`}>
                  <span>Secure This Piece</span>
                  <span>→</span>
                </Link>
              ) : (
                <Link className="btn" href="/access">
                  <span>Inquire About This Piece</span>
                  <span>→</span>
                </Link>
              )}
              <button type="button" className="btn btn-white">
                <span>Save</span>
                <span>◇</span>
              </button>
            </div>
          </Revealer>

          <section className="mt-14 border-t border-white/10 pt-10">
            <p className="kicker">Provenance</p>
            <p className="body mt-5 max-w-xl">{p.provenanceCopy}</p>
          </section>

          <section className="mt-10">
            <p className="kicker mb-5">Specifications</p>
            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
              {[
                ['Reference', p.ref],
                ['Category', p.category],
                ['Gender', p.gender],
                ['Case / Size', p.caseSize],
                ['Movement', p.movement],
                ['Material', p.material],
                ['Condition', p.condition],
                ['Status', p.status],
              ].map(([k, v]) => (
                <div key={k} className="bg-black p-5">
                  <p className="text-[9px] uppercase tracking-[.2em] text-white/35">{k}</p>
                  <p className="mt-2 text-sm text-white/80">{v}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {p.featureSections?.map((section, i) => (
        <ProductFeatureBand key={`${section.title}-${i}`} section={section} index={i} />
      ))}

      <section className="container-lux py-24">
        <p className="kicker">Related Pieces</p>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((x) => (
            <ProductCard key={x.id} p={x} />
          ))}
        </div>
      </section>
    </main>
  );
}
