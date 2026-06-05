import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getProducts, saveProducts, appendAudit } from '@/lib/data';
import { getAdminActor, isAdmin } from '@/lib/auth';
import type { Product } from '@/lib/types';

const FeatureSectionSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  body: z.string(),
  image: z.string(),
  imagePosition: z.enum(['left', 'right']).optional(),
});

const ProductSchema = z
  .object({
    id: z.string().optional(),
    slug: z.string().min(2),
    brand: z.string().min(1),
    name: z.string().min(1),
    ref: z.string().min(1),
    price: z.number(),
    type: z.enum(['Watch', 'Jewelry']),
    tag: z.string(),
    year: z.number(),
    condition: z.string(),
    caseSize: z.string(),
    material: z.string(),
    movement: z.string(),
    boxPapers: z.string(),
    location: z.string(),
    status: z.string(),
    published: z.boolean(),
    featured: z.boolean(),
    category: z.enum(['watches', 'jewelry']),
    gender: z.enum(['men', 'women', 'unisex']),
    verified: z.boolean(),
    mockLayout: z.boolean(),
    heroImage: z.string(),
    cardImage: z.string(),
    galleryImages: z.array(z.string()).default([]),
    modelUrl: z.string().default(''),
    description: z.string(),
    provenanceCopy: z.string(),
    sortOrder: z.number(),
    listedAt: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: 'Invalid ISO datetime' }),
    featureSections: z.array(FeatureSectionSchema).optional(),
  })
  .refine((d) => !d.mockLayout || !d.published, {
    message: 'MOCK_LAYOUT_ONLY pieces cannot be published as inventory',
  })
  .refine((d) => !d.mockLayout || !d.featured, {
    message: 'MOCK_LAYOUT_ONLY pieces cannot be featured',
  });

export async function GET(req: Request) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await getProducts(true));
}

export async function POST(req: Request) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const raw = (await req.json()) as Product;
  const normalized = {
    ...raw,
    published: raw.mockLayout ? false : raw.published,
    featured: raw.mockLayout ? false : raw.featured,
  };

  const parsed = ProductSchema.safeParse(normalized);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid product', issues: parsed.error.flatten() }, { status: 400 });
  }

  const products = await getProducts(true);
  const i = parsed.data.id ? products.findIndex((p) => p.id === parsed.data.id) : -1;
  const isUpdate = i >= 0;
  const existing = isUpdate ? products[i] : undefined;

  const product: Product = {
    ...parsed.data,
    id: parsed.data.id || crypto.randomUUID(),
    published: parsed.data.mockLayout ? false : parsed.data.published,
    featured: parsed.data.mockLayout ? false : parsed.data.featured,
    listedAt: parsed.data.listedAt || new Date().toISOString(),
    galleryImages: parsed.data.galleryImages.length ? parsed.data.galleryImages : [parsed.data.heroImage],
    featureSections: parsed.data.featureSections ?? existing?.featureSections,
  };

  const duplicateSlug = products.some((p) => p.slug === product.slug && p.id !== product.id);
  if (duplicateSlug) {
    return NextResponse.json({ error: 'Product slug must be unique' }, { status: 400 });
  }

  if (isUpdate) products[i] = product;
  else products.unshift(product);

  await saveProducts(products);

  const actor = (await getAdminActor()) || 'dev-token';
  await appendAudit({
    action: isUpdate ? 'product.update' : 'product.create',
    actor,
    target: product.slug,
    detail: `${product.brand} ${product.name} · ${product.mockLayout ? 'mock' : 'live'}`,
  });

  return NextResponse.json(product);
}
