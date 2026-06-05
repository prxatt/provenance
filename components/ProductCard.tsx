'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { productCardImage } from '@/lib/catalog';
import { isAvailableSku } from '@/lib/collection';
import { money } from '@/lib/format';

type Props = { p: Product; className?: string };

export default function ProductCard({ p, className = '' }: Props) {
  const available = isAvailableSku(p);
  const isMock = p.mockLayout;

  function move(e: React.MouseEvent<HTMLElement>) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) translateY(-6px)`;
  }

  function leave(e: React.MouseEvent<HTMLElement>) {
    e.currentTarget.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  }

  const body = (
    <>
      <div className={`shine relative aspect-square overflow-hidden border bg-[#050505] ${isMock ? 'border-amber-500/25 opacity-75' : 'border-white/10'}`}>
        <Image
          src={productCardImage(p)}
          alt={`${p.brand} ${p.name}`}
          fill
          className={`object-cover object-top transition duration-700 ${isMock ? 'opacity-45 saturate-0' : 'opacity-70 saturate-0 group-hover:scale-105 group-hover:opacity-95 group-hover:saturate-100'}`}
        />
        <div className="absolute inset-0 bg-radial from-transparent to-black/70" />
        {isMock ? (
          <span className="absolute left-3 top-3 border border-amber-500/40 bg-black/80 px-2 py-1 text-[8px] font-semibold uppercase tracking-[.22em] text-amber-400/90">
            Sample Layout
          </span>
        ) : (
          <>
            {p.verified && (
              <span className="absolute right-3 top-3 border border-[var(--gold)]/30 bg-black/70 px-2 py-1 text-[8px] font-semibold uppercase tracking-[.22em] text-[var(--gold)]">
                Verified
              </span>
            )}
            {available && (
              <span className="absolute bottom-3 left-3 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[.22em] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.6)]" />
                Available
              </span>
            )}
          </>
        )}
      </div>
      <div className="mt-5 text-center">
        <p className="text-[9px] font-semibold uppercase tracking-[.24em] text-[var(--gold)]">{p.brand}</p>
        <h3 className="serif mt-2 text-2xl leading-none text-white/90">{p.name}</h3>
        <p className="mt-2 text-[10px] uppercase tracking-[.16em] text-white/38">Ref. {p.ref}</p>
        <p className={`serif mt-2 text-lg ${isMock ? 'text-white/45' : 'text-white'}`}>{money(p.price)}</p>
      </div>
    </>
  );

  if (isMock) {
    return (
      <div
        className={`watch-card group block cursor-default ${className}`}
        aria-label={`${p.brand} ${p.name} — layout sample only`}
      >
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/product/${p.slug}`}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`watch-card interactive group block transition-transform duration-500 ${className}`}
    >
      {body}
    </Link>
  );
}
