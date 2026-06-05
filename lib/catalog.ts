import type { Product } from './types';

export function isInventoryProduct(p: Product) {
  return p.published && !p.mockLayout && p.verified;
}

export function productCardImage(p: Product) {
  return p.cardImage || '/images/hero/hero.png';
}

export function productHeroImage(p: Product) {
  return p.heroImage || p.cardImage || '/images/hero/hero.png';
}

export function productGallery(p: Product) {
  const images = p.galleryImages?.filter(Boolean) ?? [];
  return images.length ? images : [productHeroImage(p)];
}
