/**
 * Smoke tests for bug-fix regressions. Run: node scripts/smoke-test.mjs
 * Requires dev server on PORT (default 3000).
 */
const BASE = process.env.TEST_BASE || 'http://localhost:3000';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-this-admin-token';

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`✓ ${name}`);
  } catch (e) {
    failed++;
    console.error(`✗ ${name}`);
    console.error(`  ${e instanceof Error ? e.message : e}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  await test('/admin returns 404', async () => {
    const res = await fetch(`${BASE}/admin`);
    assert(res.status === 404, `expected 404, got ${res.status}`);
  });

  await test('checkout rejects missing acknowledgements', async () => {
    const res = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productSlug: 'diamond-tennis-bracelet',
        email: 'test@example.com',
        name: 'Test',
        amount: 18200,
        acknowledgements: { finalSale: true, insuredShipping: false, authenticity: false, preOwnedLegal: false },
      }),
    });
    assert(res.status === 400, `expected 400, got ${res.status}`);
    const data = await res.json();
    assert(data.error, 'expected error message');
  });

  await test('checkout rejects invalid product', async () => {
    const ack = { finalSale: true, insuredShipping: true, authenticity: true, preOwnedLegal: true };
    const res = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productSlug: 'nonexistent-slug',
        email: 'test@example.com',
        name: 'Test',
        amount: 100,
        acknowledgements: ack,
      }),
    });
    assert(res.status === 404, `expected 404, got ${res.status}`);
  });

  await test('checkout succeeds for valid tennis bracelet order', async () => {
    const ack = { finalSale: true, insuredShipping: true, authenticity: true, preOwnedLegal: true };
    const res = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        productSlug: 'diamond-tennis-bracelet',
        email: 'smoke-test@example.com',
        name: 'Smoke Test',
        amount: 18200,
        acknowledgements: ack,
      }),
    });
    assert(res.ok, `expected 200, got ${res.status}`);
    const order = await res.json();
    assert(order.status === 'Pending concierge review', `unexpected status: ${order.status}`);
  });

  await test('products API rejects duplicate slug on create', async () => {
    const res = await fetch(`${BASE}/api/products`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      body: JSON.stringify({
        slug: 'rolex-submariner-date',
        brand: 'Duplicate',
        name: 'Test',
        ref: 'TEST',
        price: 1,
        type: 'Watch',
        tag: 'Test',
        year: 2024,
        condition: 'New',
        caseSize: '40mm',
        material: 'Steel',
        movement: 'Auto',
        boxPapers: 'Yes',
        location: 'NY',
        status: 'Available',
        published: false,
        featured: false,
        category: 'watches',
        gender: 'men',
        verified: true,
        mockLayout: false,
        heroImage: '/images/watches/watches.png',
        cardImage: '/images/watches/watches.png',
        galleryImages: [],
        modelUrl: '',
        description: 'test',
        provenanceCopy: 'test',
        sortOrder: 99,
        listedAt: new Date().toISOString(),
      }),
    });
    assert(res.status === 400, `expected 400, got ${res.status}`);
    const data = await res.json();
    assert(data.error?.includes('unique'), `expected unique slug error, got ${JSON.stringify(data)}`);
  });

  await test('products API rejects invalid listedAt', async () => {
    const res = await fetch(`${BASE}/api/products`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      body: JSON.stringify({
        slug: 'invalid-date-test',
        brand: 'Test',
        name: 'Test',
        ref: 'TEST',
        price: 1,
        type: 'Watch',
        tag: 'Test',
        year: 2024,
        condition: 'New',
        caseSize: '40mm',
        material: 'Steel',
        movement: 'Auto',
        boxPapers: 'Yes',
        location: 'NY',
        status: 'Available',
        published: false,
        featured: false,
        category: 'watches',
        gender: 'men',
        verified: true,
        mockLayout: false,
        heroImage: '/images/watches/watches.png',
        cardImage: '/images/watches/watches.png',
        galleryImages: [],
        modelUrl: '',
        description: 'test',
        provenanceCopy: 'test',
        sortOrder: 99,
        listedAt: 'not-a-date',
      }),
    });
    assert(res.status === 400, `expected 400, got ${res.status}`);
  });

  await test('tennis bracelet PDP loads', async () => {
    const res = await fetch(`${BASE}/product/diamond-tennis-bracelet`);
    assert(res.ok, `expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes('Tennis Bracelet'), 'missing product title');
    assert(html.includes('Stone Line'), 'missing featured section');
    assert(html.includes('diamond-tennis-bracelet-master'), 'missing product image');
  });

  await test('studio sets noindex header', async () => {
    const res = await fetch(`${BASE}/studio-provenance-private`);
    assert(res.headers.get('x-robots-tag')?.includes('noindex'), 'missing noindex header');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

main();
