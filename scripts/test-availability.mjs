/** Availability logic checks. Run: node scripts/test-availability.mjs */

function isInventoryProduct(p) {
  return p.published && !p.mockLayout && p.verified;
}

function isAvailableSku(p) {
  return isInventoryProduct(p) && p.status === 'Available';
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const base = {
  published: true,
  mockLayout: false,
  verified: true,
  status: 'Available',
};

assert(isInventoryProduct(base), 'published verified inventory');
assert(isAvailableSku(base), 'available sku');
assert(!isAvailableSku({ ...base, status: 'Reserved' }), 'reserved not purchasable');
assert(!isAvailableSku({ ...base, status: 'Sold' }), 'sold not purchasable');
assert(!isAvailableSku({ ...base, published: false }), 'unpublished not available');
assert(!isAvailableSku({ ...base, verified: false }), 'unverified not available');

console.log('availability tests passed');
