import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getProducts, saveProducts, appendAudit } from '@/lib/data';
import { getAdminActor, isAdmin } from '@/lib/auth';
import type { Product } from '@/lib/types';

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
    galleryImages: z.array(z.string()),
    modelUrl: z.string(),
    description: z.string(),
    provenanceCopy: z.string(),
    sortOrder: z.number(),
    listedAt: z.string(),
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
  const parsed = ProductSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid product', issues: parsed.error.flatten() }, { status: 400 });
  }

  const products = await getProducts(true);
  const product: Product = {
    ...parsed.data,
    id: parsed.data.id || crypto.randomUUID(),
    published: parsed.data.mockLayout ? false : parsed.data.published,
    featured: parsed.data.mockLayout ? false : parsed.data.featured,
    listedAt: parsed.data.listedAt || new Date().toISOString(),
  };

  const i = products.findIndex((p) => p.id === product.id || p.slug === product.slug);
  const isUpdate = i >= 0;
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
