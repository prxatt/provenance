'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { productHeroImage } from '@/lib/catalog';

type Props = {
  product: Product;
  images: string[];
};

export default function ProductStage({ product, images }: Props) {
  const [active, setActive] = useState(0);
  const hero = images[active] || productHeroImage(product);

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-[50vh] flex-1 overflow-hidden bg-[#030303] lg:min-h-0">
        <Image
          key={hero}
          src={hero}
          alt={`${product.brand} ${product.name}`}
          fill
          priority
          className="object-cover object-top opacity-90 saturate-75 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent,rgba(0,0,0,.88)_70%)]" />
        {product.modelUrl && (
          <div className="absolute left-6 top-6 border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-sm">
            <p className="text-[9px] font-semibold uppercase tracking-[.24em] text-[var(--gold)]">360° View</p>
            <p className="mt-1 text-[10px] text-white/45">3D model loading when GLB is available</p>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 border-t border-white/10 bg-black p-4">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden border bg-[#050505] transition ${i === active ? 'border-[var(--gold)]' : 'border-white/10 opacity-60 hover:opacity-100'}`}
            >
              <Image src={src} alt="" fill className="object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
