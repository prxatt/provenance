import type { Product } from './types';
import { PRODUCT_STATUS_AVAILABLE } from './constants';

export function isInventoryProduct(p: Product) {
  return p.published && !p.mockLayout && p.verified;
}

export function isAvailableSku(p: Product) {
  return isInventoryProduct(p) && p.status === PRODUCT_STATUS_AVAILABLE;
}

export function isMockLayoutProduct(p: Product) {
  return p.mockLayout;
}

export function productAdminStatus(p: Product) {
  if (isInventoryProduct(p)) return 'Live';
  if (p.mockLayout) return 'Sample layout';
  return 'Hidden';
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
