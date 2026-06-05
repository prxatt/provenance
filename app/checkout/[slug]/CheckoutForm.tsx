'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { money } from '@/lib/format';
import { HIGH_VALUE_THRESHOLD } from '@/lib/constants';

type Acknowledgements = {
  finalSale: boolean;
  insuredShipping: boolean;
  authenticity: boolean;
  preOwnedLegal: boolean;
};

export default function CheckoutForm({ product }: { product: Product }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ack, setAck] = useState<Acknowledgements>({
    finalSale: false,
    insuredShipping: false,
    authenticity: false,
    preOwnedLegal: false,
  });

  const allChecked = useMemo(() => Object.values(ack).every(Boolean), [ack]);
  const isHighValue = product.price > HIGH_VALUE_THRESHOLD;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allChecked) return;
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const payload = {
      email: f.get('email'),
      name: f.get('name'),
      phone: f.get('phone') || undefined,
      shippingCity: f.get('shippingCity') || undefined,
      note: f.get('note') || undefined,
      productSlug: product.slug,
      amount: product.price,
      acknowledgements: ack,
    };
    const res = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'content-type': 'application/json' },
    });
    setLoading(false);
    if (res.ok) setDone(true);
  }

  if (done) {
    return (
      <div className="panel mt-10 p-8">
        <p className="kicker">Request secured</p>
        <h2 className="serif mt-3 text-4xl">Concierge review started.</h2>
        <p className="body mt-4">
          {isHighValue
            ? 'Private purchase review required for this value. Our team will contact you with next steps.'
            : 'Your purchase request is logged. Production will connect this to Stripe Checkout and insured fulfillment.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-4">
      {isHighValue && (
        <div className="border border-[var(--gold)]/40 bg-[var(--gold)]/5 p-4 text-sm text-[var(--gold)]">
          Private purchase review required for items over {money(HIGH_VALUE_THRESHOLD)}.
        </div>
      )}
      <input className="field" name="email" type="email" required placeholder="Email" />
      <input className="field" name="name" required placeholder="Full name" />
      <input className="field" name="phone" placeholder="Phone" />
      <input className="field" name="shippingCity" placeholder="Shipping city / country" />
      <textarea className="field min-h-28" name="note" placeholder="Questions, timing, or delivery notes" />

      <div className="panel space-y-4 p-5 text-sm text-white/70">
        <Check
          checked={ack.finalSale}
          onChange={(v) => setAck({ ...ack, finalSale: v })}
          label="I understand all sales are final once completed."
        />
        <Check
          checked={ack.insuredShipping}
          onChange={(v) => setAck({ ...ack, insuredShipping: v })}
          label="I agree to fully insured, signature-required shipping."
        />
        <Check
          checked={ack.authenticity}
          onChange={(v) => setAck({ ...ack, authenticity: v })}
          label="I have reviewed listing images, condition notes, and reference information."
        />
        <Check
          checked={ack.preOwnedLegal}
          onChange={(v) => setAck({ ...ack, preOwnedLegal: v })}
          label="I understand this item is pre-owned unless stated otherwise, condition is described in the listing, all sales are final, and insured signature-required shipping will be used."
        />
      </div>

      <button className="btn w-full disabled:cursor-not-allowed disabled:opacity-40" disabled={!allChecked || loading}>
        <span>{loading ? 'Securing…' : `Request Purchase ${money(product.price)}`}</span>
        <span>→</span>
      </button>

      <p className="body text-xs">
        Payment is not captured in this prototype. Stripe Checkout Session integration is prepared for production.
      </p>
    </form>
  );
}

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer gap-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1" />
      <span>{label}</span>
    </label>
  );
}
