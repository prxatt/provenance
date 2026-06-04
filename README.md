# PROVENANCE — upgraded luxury ecommerce prototype

A multi-page Next.js/Tailwind build that merges the generated cinematic mockups with your single-file HTML concept.

## Run
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Admin
Visit `/admin`. Use the value of `ADMIN_TOKEN` from `.env.local`.

Admin can add, edit, publish/unpublish products and review access requests + orders. This prototype uses local JSON files in `/data` through Next.js Route Handlers. For production, replace the JSON data adapter with Supabase, Neon/Postgres, Shopify, or Sanity.

## Included pages
- `/`
- `/collection`
- `/product/[slug]`
- `/about`
- `/access`
- `/account`
- `/checkout/[slug]`
- `/legal/terms`
- `/legal/shipping`
- `/legal/privacy`
- `/legal/authentication`
- `/admin`

## Notes
The checkout is a high-trust request/order flow, not live card processing. Add Stripe Checkout when inventory, tax, escrow, and fulfillment rules are finalized.

## Deploy (Vercel)
This repo is linked to [Vercel — provenance](https://vercel.com/pratt/provenance). Pushes to `main` trigger preview/production deploys.

Set these environment variables in the Vercel project:

| Variable | Purpose |
|----------|---------|
| `ADMIN_TOKEN` | Secret for `/admin` API routes |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (e.g. `https://provenance.vercel.app`) |

`@vercel/analytics` is wired in `app/layout.tsx` via `<Analytics />`.
