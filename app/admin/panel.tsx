'use client';

import { useEffect, useState } from 'react';
import type { Product, AccessRequest, Order } from '@/lib/types';
import { productAdminStatus } from '@/lib/catalog';
import { money } from '@/lib/format';

type AdminData = { products: Product[]; access: AccessRequest[]; orders: Order[] };

const getBlankProduct = (): Product => ({
  id: '',
  slug: '',
  brand: '',
  name: '',
  ref: '',
  price: 0,
  type: 'Watch',
  tag: 'New Arrival',
  year: new Date().getFullYear(),
  condition: 'Excellent',
  caseSize: '',
  material: '',
  movement: '',
  boxPapers: 'Included',
  location: 'Los Angeles, CA',
  status: 'Available',
  published: true,
  featured: false,
  category: 'watches',
  gender: 'men',
  verified: true,
  mockLayout: false,
  heroImage: '/images/watches/watches.png',
  cardImage: '/images/watches/watches.png',
  galleryImages: [],
  modelUrl: '',
  description: '',
  provenanceCopy: '',
  sortOrder: 99,
  listedAt: new Date().toISOString(),
});

export default function AdminPanel({ clerkMode = false }: { clerkMode?: boolean }) {
  const [token, setToken] = useState('');
  const [data, setData] = useState<AdminData | null>(null);
  const [audit, setAudit] = useState<{ action: string; actor: string; target?: string; createdAt: string }[]>([]);
  const [msg, setMsg] = useState('');
  const [edit, setEdit] = useState<Product>(() => getBlankProduct());

  async function load() {
    setMsg('Loading…');
    const h: Record<string, string> = clerkMode ? {} : { 'x-admin-token': token };
    const [p, a, o, au] = await Promise.all([
      fetch('/api/products', { headers: h }),
      fetch('/api/access', { headers: h }),
      fetch('/api/orders', { headers: h }),
      fetch('/api/audit', { headers: h }),
    ]);
    if (!p.ok) {
      setMsg(clerkMode ? 'Unauthorized studio session.' : 'Unauthorized. Check ADMIN_TOKEN in .env.local.');
      return;
    }
    setData({ products: await p.json(), access: await a.json(), orders: await o.json() });
    if (au.ok) setAudit(await au.json());
    setMsg('Admin vault unlocked.');
  }

  useEffect(() => {
    if (clerkMode) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkMode]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Saving…');
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(clerkMode ? {} : { 'x-admin-token': token }),
      },
      body: JSON.stringify({
        ...edit,
        price: Number(edit.price),
        year: Number(edit.year),
        galleryImages: (edit.galleryImages ?? []).length ? edit.galleryImages : [edit.heroImage],
      }),
    });
    setMsg(res.ok ? 'Saved.' : 'Save failed.');
    if (res.ok) load();
  }

  function set<K extends keyof Product>(k: K, v: Product[K]) {
    setEdit({ ...edit, [k]: v });
  }

  return (
    <section className="container-lux">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="kicker">Admin Only</p>
          <h1 className="h1 mt-4">Provenance Control Room</h1>
          <p className="body mt-4 max-w-2xl">
            Add inventory, update copy, publish/unpublish pieces, and review access/order requests. Mock layout pieces
            cannot be published.
          </p>
        </div>
        <div className="flex min-w-[320px] gap-3">
          {!clerkMode && (
            <input
              className="field"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ADMIN_TOKEN"
            />
          )}
          <button onClick={load} className="btn min-w-0">
            <span>{clerkMode ? 'Refresh' : 'Unlock'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
      {msg && <p className="mt-6 text-sm text-[var(--gold)]">{msg}</p>}
      {data && (
        <div className="admin-grid mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-8">
            <div className="panel p-6">
              <h2 className="serif text-4xl">Inventory</h2>
              <div className="mt-6 space-y-3">
                {data.products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setEdit({ ...p, galleryImages: p.galleryImages ?? [] })}
                    className="flex w-full items-center justify-between border-b border-white/10 py-4 text-left transition hover:bg-white/[.025]"
                  >
                    <span>
                      <span className="serif text-2xl">
                        {p.brand} {p.name}
                      </span>
                      <span className="ml-3 text-xs text-white/40">{p.ref}</span>
                      {p.mockLayout && (
                        <span className="ml-2 text-[9px] uppercase tracking-[.2em] text-amber-400">Mock layout</span>
                      )}
                    </span>
                    <span className="text-sm text-white/60">
                      {money(p.price)} · {productAdminStatus(p)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <Log title="Access Requests" items={data.access.map((x) => [x.email, x.interest || x.name || 'Private access'])} />
              <Log title="Order Requests" items={data.orders.map((x) => [x.email, `${x.productSlug} · ${money(x.amount)}`])} />
            </div>
            {audit.length > 0 && (
              <div className="panel p-6">
                <h3 className="serif text-3xl">Audit log</h3>
                <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                  {audit.slice(0, 20).map((e, i) => (
                    <div key={i} className="border-b border-white/10 pb-3 text-sm">
                      <p className="text-white/80">
                        {e.action} · {e.target}
                      </p>
                      <p className="text-xs text-white/40">
                        {e.actor} · {new Date(e.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <form onSubmit={save} className="panel h-max p-6">
            <div className="flex items-center justify-between">
              <h2 className="serif text-4xl">Edit Piece</h2>
              <button type="button" onClick={() => setEdit(getBlankProduct())} className="text-[10px] uppercase tracking-[.2em] text-[var(--gold)]">
                New
              </button>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {(
                [
                  'slug',
                  'brand',
                  'name',
                  'ref',
                  'type',
                  'tag',
                  'condition',
                  'caseSize',
                  'material',
                  'movement',
                  'boxPapers',
                  'location',
                  'status',
                  'heroImage',
                  'cardImage',
                  'modelUrl',
                ] as const
              ).map((k) => (
                <input
                  key={k}
                  className="field"
                  value={String(edit[k])}
                  onChange={(e) => set(k, e.target.value as never)}
                  placeholder={k}
                />
              ))}
              <input
                className="field"
                type="number"
                value={edit.price}
                onChange={(e) => set('price', Number(e.target.value))}
                placeholder="price"
              />
              <input
                className="field"
                type="number"
                value={edit.year}
                onChange={(e) => set('year', Number(e.target.value))}
                placeholder="year"
              />
              <input
                className="field"
                type="number"
                value={edit.sortOrder}
                onChange={(e) => set('sortOrder', Number(e.target.value))}
                placeholder="sortOrder"
              />
              <select className="field" value={edit.category} onChange={(e) => set('category', e.target.value as Product['category'])}>
                <option value="watches">watches</option>
                <option value="jewelry">jewelry</option>
              </select>
              <select className="field" value={edit.gender} onChange={(e) => set('gender', e.target.value as Product['gender'])}>
                <option value="men">men</option>
                <option value="women">women</option>
                <option value="unisex">unisex</option>
              </select>
              <input
                className="field md:col-span-2"
                value={(edit.galleryImages ?? []).join(', ')}
                onChange={(e) =>
                  set(
                    'galleryImages',
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="galleryImages (comma-separated paths)"
              />
            </div>
            <textarea className="field mt-3 min-h-28" value={edit.description} onChange={(e) => set('description', e.target.value)} placeholder="Description" />
            <textarea
              className="field mt-3 min-h-28"
              value={edit.provenanceCopy}
              onChange={(e) => set('provenanceCopy', e.target.value)}
              placeholder="Provenance copy"
            />
            <div className="mt-4 flex flex-wrap gap-6 text-sm text-white/60">
              <label>
                <input type="checkbox" checked={edit.published} onChange={(e) => set('published', e.target.checked)} disabled={edit.mockLayout} />{' '}
                Published
              </label>
              <label>
                <input type="checkbox" checked={edit.featured} onChange={(e) => set('featured', e.target.checked)} disabled={edit.mockLayout} />{' '}
                Featured
              </label>
              <label>
                <input type="checkbox" checked={edit.verified} onChange={(e) => set('verified', e.target.checked)} /> Verified
              </label>
              <label>
                <input type="checkbox" checked={edit.mockLayout} onChange={(e) => set('mockLayout', e.target.checked)} /> Mock layout only
              </label>
            </div>
            <button className="btn mt-6 w-full">
              <span>Save Product</span>
              <span>→</span>
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

function Log({ title, items }: { title: string; items: string[][] }) {
  return (
    <div className="panel p-6">
      <h3 className="serif text-3xl">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((x, i) => (
            <div key={i} className="border-b border-white/10 pb-3">
              <p className="text-sm text-white/80">{x[0]}</p>
              <p className="text-xs text-white/40">{x[1]}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-white/40">No entries yet.</p>
        )}
      </div>
    </div>
  );
}
