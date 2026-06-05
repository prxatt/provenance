import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addOrder, getOrders, getPurchasableProduct } from '@/lib/data';
import { isAdmin } from '@/lib/auth';

const AckSchema = z.object({
  finalSale: z.boolean(),
  insuredShipping: z.boolean(),
  authenticity: z.boolean(),
  preOwnedLegal: z.boolean(),
});

const Schema = z.object({
  productSlug: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  shippingCity: z.string().optional(),
  note: z.string().optional(),
  amount: z.number(),
  acknowledgements: AckSchema,
});

export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const product = await getPurchasableProduct(parsed.data.productSlug);
  if (!product) return NextResponse.json({ error: 'Product unavailable for purchase' }, { status: 404 });

  const ack = parsed.data.acknowledgements;
  if (!ack.finalSale || !ack.insuredShipping || !ack.authenticity || !ack.preOwnedLegal) {
    return NextResponse.json({ error: 'All acknowledgements required' }, { status: 400 });
  }

  return NextResponse.json(
    await addOrder({
      ...parsed.data,
      amount: product.price,
      acknowledgements: ack,
    }),
  );
}

export async function GET(req: Request) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await getOrders());
}
