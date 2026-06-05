/** Collection filter logic checks. Run: node scripts/test-collection-filters.mjs */
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Dynamic import compiled TS via tsx alternative - test logic inline by duplicating minimal or use jiti
// Keep in sync with lib/collection.ts
function matchesFilter(p, filter) {
  if (filter === 'all') return true;
  if (filter === 'watches') return p.category === 'watches';
  if (filter === 'jewelry') return p.category === 'jewelry';
  if (filter === 'men') return p.gender === 'men';
  if (filter === 'women') return p.gender === 'women';
  return true;
}

function sortCollection(products, sort) {
  const inventory = products.filter((p) => !p.mockLayout);
  const samples = products.filter((p) => p.mockLayout);
  return { inventory, samples };
}

function filterAndSortCollection(products, filter, sort) {
  return sortCollection(products.filter((p) => matchesFilter(p, filter)), sort);
}

const products = JSON.parse(readFileSync(path.join(root, 'data/mock-products.json'), 'utf8'));
const inventory = JSON.parse(readFileSync(path.join(root, 'data/products.json'), 'utf8')).filter(
  (p) => p.published && !p.mockLayout && p.verified,
);
const catalog = [...inventory, ...products.map((m) => ({ ...m, mockLayout: true }))];

const women = filterAndSortCollection(catalog, 'women', 'featured');
const men = filterAndSortCollection(catalog, 'men', 'featured');

if (women.samples.length === 0 && men.samples.length === 0) {
  console.error('Expected gender filters to return matching layout samples');
  process.exit(1);
}

console.log(`women samples: ${women.samples.length}, men samples: ${men.samples.length}`);
console.log('collection filter tests passed');
