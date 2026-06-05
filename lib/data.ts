import fs from 'node:fs/promises';
import path from 'node:path';
import { isInventoryProduct, isAvailableSku } from './catalog';
import { HIGH_VALUE_THRESHOLD, ORDER_STATUS } from './constants';
import type { Product, AccessRequest, Order, AuditEntry } from './types';

const dataDir = path.join(process.cwd(), 'data');

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(dataDir, file), 'utf8')) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, file), JSON.stringify(data, null, 2), 'utf8');
}

export async function getMockProducts() {
  const mocks = await readJson<Product[]>('mock-products.json', []);
  return mocks.map((m) => ({ ...m, mockLayout: true, published: false, verified: false }));
}

/** Published verified inventory only. */
export async function getProducts(all = false) {
  const products = await readJson<Product[]>('products.json', []);
  return all ? products : products.filter(isInventoryProduct);
}

/** Collection: verified inventory + layout samples (studio + mock-products.json). */
export async function getCollectionCatalog() {
  const all = await getProducts(true);
  const inventory = all.filter(isInventoryProduct);
  const studioMocks = all.filter((p) => p.mockLayout);
  const fileMocks = await getMockProducts();
  const studioSlugs = new Set(studioMocks.map((p) => p.slug));
  const extraMocks = fileMocks.filter((p) => !studioSlugs.has(p.slug));
  return [...inventory, ...studioMocks, ...extraMocks];
}

export async function getProduct(slug: string) {
  const product = (await getProducts(true)).find((p) => p.slug === slug);
  if (!product || !isInventoryProduct(product)) return undefined;
  return product;
}

/** Purchasable inventory only — status must be Available. */
export async function getPurchasableProduct(slug: string) {
  const product = await getProduct(slug);
  if (!product || !isAvailableSku(product)) return undefined;
  return product;
}

export async function saveProducts(products: Product[]) {
  await writeJson('products.json', products);
}

export async function getAccessRequests() {
  return readJson<AccessRequest[]>('access.json', []);
}

export async function addAccessRequest(r: Omit<AccessRequest, 'id' | 'createdAt'>) {
  const list = await getAccessRequests();
  const item = { ...r, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  list.unshift(item);
  await writeJson('access.json', list);
  return item;
}

export async function getOrders() {
  return readJson<Order[]>('orders.json', []);
}

export async function addOrder(r: Omit<Order, 'id' | 'createdAt' | 'status'>) {
  const list = await getOrders();
  const item = {
    ...r,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: r.amount > HIGH_VALUE_THRESHOLD ? ORDER_STATUS.highValue : ORDER_STATUS.standard,
  };
  list.unshift(item);
  await writeJson('orders.json', list);
  return item;
}

export async function getAuditLog() {
  return readJson<AuditEntry[]>('audit-log.json', []);
}

export async function appendAudit(entry: Omit<AuditEntry, 'id' | 'createdAt'>) {
  const list = await getAuditLog();
  const item = { ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  list.unshift(item);
  await writeJson('audit-log.json', list.slice(0, 500));
  return item;
}

export const img = {
  hero: '/images/hero/hero.png',
  about: '/images/about/about.png',
  watches: '/images/watches/watches.png',
  jewelry: '/images/jewelry/jewelry.png',
  trust: '/images/about/about.png',
  collection: '/images/assets/collection.png',
  collectionHero: '/images/hero/hero.png',
  access: '/images/hero/hero.png',
  account: '/images/assets/mock-layouts/ui-account-dashboard.png',
  checkout: '/images/assets/mock-layouts/ui-checkout.png',
  legal: '/images/assets/mock-layouts/ui-legal-page.png',
  void: '/images/assets/mock-layouts/ui-void-transition.png',
  mockWatchSheet: '/images/assets/watch-assets.png',
  mockCollectionPage: '/images/assets/collection.png',
};

export const money = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);

export function getAdminPath() {
  return process.env.ADMIN_PATH || '/_studio-provenance-private';
}
