import type { Product } from './types';

export type CollectionFilter = 'all' | 'watches' | 'jewelry' | 'men' | 'women';
export type CollectionSort = 'featured' | 'price-high' | 'price-low' | 'newest';

function compareInventory(a: Product, b: Product, sort: CollectionSort) {
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

export function matchesFilter(p: Product, filter: CollectionFilter) {
  if (filter === 'all') return true;
  if (filter === 'watches') return p.category === 'watches';
  if (filter === 'jewelry') return p.category === 'jewelry';
  if (filter === 'men') return p.gender === 'men';
  if (filter === 'women') return p.gender === 'women';
  return true;
}

export function sortCollection(products: Product[], sort: CollectionSort) {
  const inventory = products.filter((p) => !p.mockLayout);
  const samples = products.filter((p) => p.mockLayout);

  return {
    inventory: [...inventory].sort((a, b) => compareInventory(a, b, sort)),
    samples: [...samples].sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

export function filterAndSortCollection(products: Product[], filter: CollectionFilter, sort: CollectionSort) {
  return sortCollection(
    products.filter((p) => matchesFilter(p, filter)),
    sort,
  );
}

export { isAvailableSku } from './catalog';

export function splitByCategory(products: Product[]) {
  return {
    watches: products.filter((p) => p.category === 'watches'),
    jewelry: products.filter((p) => p.category === 'jewelry'),
  };
}
