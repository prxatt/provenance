'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import {
  type CollectionFilter,
  type CollectionSort,
  filterAndSortCollection,
  splitByCategory,
} from '@/lib/collection';
import ProductCard from '@/components/ProductCard';
import Revealer from '@/components/Revealer';
import TrustFooterStrip from '@/components/TrustFooterStrip';

const FILTERS: { id: CollectionFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'watches', label: 'Watches' },
  { id: 'jewelry', label: 'Jewelry' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
];

const SORTS: { id: CollectionSort; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-high', label: 'Price: High' },
  { id: 'price-low', label: 'Price: Low' },
];

type Props = {
  products: Product[];
  heroImage: string;
  watchesImage: string;
  jewelryImage: string;
};

function ProductGrid({ items, startIndex = 0 }: { items: Product[]; startIndex?: number }) {
  return (
    <div className="collection-grid grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((p, i) => (
        <Revealer key={p.id} delay={(startIndex + i) * 0.06}>
          <ProductCard p={p} />
        </Revealer>
      ))}
    </div>
  );
}

function EditorialBand({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  return (
    <div className="relative my-16 overflow-hidden border border-white/10 bg-[#050505]">
      <div className="relative aspect-[21/8] min-h-[180px]">
        <Image src={image} alt="" fill className="object-cover object-top opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
          <p className="kicker">{subtitle}</p>
          <h2 className="serif mt-3 text-3xl md:text-5xl">{title}</h2>
        </div>
      </div>
    </div>
  );
}

export default function CollectionView({ products, heroImage, watchesImage, jewelryImage }: Props) {
  const [filter, setFilter] = useState<CollectionFilter>('all');
  const [sort, setSort] = useState<CollectionSort>('featured');

  const { inventory, samples } = useMemo(
    () => filterAndSortCollection(products, filter, sort),
    [products, filter, sort],
  );

  const { watches, jewelry } = splitByCategory(inventory);
  const showSamples = filter === 'all' || filter === 'watches' || filter === 'jewelry';
  const showSplit = filter === 'all' && inventory.length > 0;

  return (
    <main className="pt-24 md:pt-32">
      <section className="relative min-h-[42vh] overflow-hidden border-b border-white/10">
        <Image src={heroImage} alt="" fill priority className="object-cover object-top opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="container-lux relative z-10 flex min-h-[42vh] flex-col justify-end pb-12 pt-28">
          <Revealer>
            <p className="kicker">Curated inventory</p>
            <h1 className="h1 mt-4 max-w-3xl">Collection</h1>
            <p className="body mt-5 max-w-xl">
              Curated timepieces and fine jewelry. Each with a story. Each verified.
            </p>
          </Revealer>
        </div>
      </section>

      <section className="sticky top-20 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="container-lux flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[.22em]">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`navlink transition ${filter === f.id ? 'active gold' : 'text-white/40'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-white/45">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as CollectionSort)}
              className="field min-w-[160px] cursor-pointer py-2 text-[10px] uppercase tracking-[.18em]"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="container-lux py-14 md:py-20">
        {inventory.length === 0 && (!showSamples || samples.length === 0) ? (
          <div className="panel mx-auto max-w-lg p-12 text-center">
            <p className="kicker">No pieces match</p>
            <h2 className="serif mt-4 text-3xl">Nothing in this view yet.</h2>
            <p className="body mt-4">Try another filter or check back when new inventory is published.</p>
            <button type="button" onClick={() => setFilter('all')} className="btn mx-auto mt-8">
              <span>View All</span>
              <span>→</span>
            </button>
          </div>
        ) : showSplit ? (
          <>
            {watches.length > 0 && (
              <>
                <p className="kicker mb-8">Watches · {watches.length}</p>
                <ProductGrid items={watches} />
              </>
            )}
            <EditorialBand title="Timepieces anchor our catalog." subtitle="Watch culture" image={watchesImage} />
            {jewelry.length > 0 && (
              <>
                <p className="kicker mb-8">Jewelry · {jewelry.length}</p>
                <ProductGrid items={jewelry} startIndex={watches.length} />
              </>
            )}
          </>
        ) : (
          inventory.length > 0 && (
            <>
              <p className="kicker mb-8">Verified inventory · {inventory.length}</p>
              <ProductGrid items={inventory} />
            </>
          )
        )}

        {inventory.length === 0 && showSamples && samples.length > 0 && (
          <div className="panel mb-10 p-8 text-center">
            <p className="body">No verified pieces in this filter. Layout samples are shown below for reference.</p>
          </div>
        )}

        {showSamples && samples.length > 0 && (
          <section className="mt-20 border-t border-dashed border-amber-500/20 pt-14">
            <div className="mb-10 max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[.28em] text-amber-400/80">
                Layout samples — not for sale
              </p>
              <p className="body mt-3">
                These cards preview future inventory styling. They are not authenticated, not available, and cannot be
                purchased.
              </p>
            </div>
            <ProductGrid items={samples} />
          </section>
        )}
      </section>

      <TrustFooterStrip />
    </main>
  );
}
