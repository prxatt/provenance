/** Collection filter + sort checks. Run: node scripts/test-collection-filters.mjs */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function matchesFilter(p, filter) {
  if (filter === 'all') return true;
  if (filter === 'watches') return p.category === 'watches';
  if (filter === 'jewelry') return p.category === 'jewelry';
  if (filter === 'men') return p.gender === 'men';
  if (filter === 'women') return p.gender === 'women';
  return true;
}

function compareInventory(a, b, sort) {
  switch (sort) {
    case 'price-high':
      return b.price - a.price || a.sortOrder - b.sortOrder;
    case 'price-low':
      return a.price - b.price || a.sortOrder - b.sortOrder;
    case 'newest':
      return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime() || a.sortOrder - b.sortOrder;
    case 'featured':
    default:
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.sortOrder - b.sortOrder;
  }
}

function sortCollection(products, sort) {
  const inventory = products.filter((p) => !p.mockLayout);
  const samples = products.filter((p) => p.mockLayout);
  return {
    inventory: [...inventory].sort((a, b) => compareInventory(a, b, sort)),
    samples: [...samples].sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

function filterAndSortCollection(products, filter, sort) {
  return sortCollection(
    products.filter((p) => matchesFilter(p, filter)),
    sort,
  );
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const mocks = JSON.parse(readFileSync(path.join(root, 'data/mock-products.json'), 'utf8'));
const inventory = JSON.parse(readFileSync(path.join(root, 'data/products.json'), 'utf8')).filter(
  (p) => p.published && !p.mockLayout && p.verified,
);
const catalog = [...inventory, ...mocks.map((m) => ({ ...m, mockLayout: true }))];

const women = filterAndSortCollection(catalog, 'women', 'featured');
const men = filterAndSortCollection(catalog, 'men', 'featured');
assert(women.samples.length > 0 && men.samples.length > 0, 'gender filters should return layout samples');

const womenNewest = filterAndSortCollection(catalog, 'women', 'newest').inventory;
const womenPieces = womenNewest.filter((p) => p.gender === 'women' && !p.mockLayout);
if (womenPieces.length >= 2) {
  const [first, second] = womenPieces;
  const firstTime = new Date(first.listedAt).getTime();
  const secondTime = new Date(second.listedAt).getTime();
  assert(firstTime >= secondTime, 'newest sort should order by listedAt, not category');
  if (first.category === 'watches' && second.category === 'jewelry' && firstTime < secondTime) {
    throw new Error('watches should not rank above newer jewelry on mixed gender sort');
  }
}

const womenPrice = filterAndSortCollection(catalog, 'women', 'price-high').inventory.filter((p) => !p.mockLayout);
if (womenPrice.length >= 2) {
  assert(womenPrice[0].price >= womenPrice[1].price, 'price-high should sort by price across categories');
}

const mixed = [
  {
    slug: 'w-old',
    category: 'watches',
    gender: 'women',
    mockLayout: false,
    price: 1000,
    listedAt: '2020-01-01T00:00:00.000Z',
    sortOrder: 1,
    featured: false,
  },
  {
    slug: 'j-new',
    category: 'jewelry',
    gender: 'women',
    mockLayout: false,
    price: 50000,
    listedAt: '2026-06-01T00:00:00.000Z',
    sortOrder: 2,
    featured: false,
  },
];
const sorted = sortCollection(mixed, 'newest').inventory;
assert(sorted[0].slug === 'j-new', 'newer jewelry should rank above older watch');
const byPrice = sortCollection(mixed, 'price-high').inventory;
assert(byPrice[0].slug === 'j-new', 'higher-priced jewelry should rank above cheaper watch');

console.log('collection filter + sort tests passed');
