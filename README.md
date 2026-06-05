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

**Live project:** [provenance](https://vercel.com/pratt/provenance) — not `provenance-upgraded` (that project has no deployments and returns 404).

| URL | Branch |
|-----|--------|
| https://provenance-pratt.vercel.app | `main` (production) |
| PR previews | `feat/*` branches via GitHub |

Pushes to `main` deploy production. Open PRs get preview URLs on the **provenance** project.

If you see `404 NOT_FOUND` / `DEPLOYMENT_NOT_FOUND`, confirm you are on `provenance-pratt.vercel.app` or a PR preview link from the provenance project — not `provenance-upgraded.vercel.app`.

Set these environment variables in the Vercel **provenance** project:

| Variable | Purpose |
|----------|---------|
| `ADMIN_TOKEN` | Secret for `/admin` API routes |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (e.g. `https://provenance.vercel.app`) |

`@vercel/analytics` is wired in `app/layout.tsx` via `<Analytics />`.
