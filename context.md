# Omni Cartix — Project Context

## What This Is
A production-ready UK e-commerce platform built with Next.js 14 App Router. Sells three product types:
- **Physical goods** (SIC 47910)
- **Digital products** (SIC 58290)
- **SaaS/software** (SIC 62012)

Brand aesthetic: modern dark SaaS-meets-marketplace (Gumroad + Lemon Squeezy style).

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui (Zinc theme) |
| ORM | Prisma v5 |
| Database | Supabase PostgreSQL |
| Auth | NextAuth v4 (JWT strategy) |
| Payments | Stripe + PayPal |
| Email | Resend + React Email |
| File Storage | Cloudflare R2 (S3-compatible) |
| State | Zustand (cart, localStorage persist) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Money | Decimal.js (NEVER native JS float) |

---

## Environment Variables (`.env.local`)

```
DATABASE_URL        = Supabase Transaction pooler (port 6543, pgbouncer)
DIRECT_URL          = Supabase Session pooler (port 5432, IPv4 compatible)
NEXTAUTH_URL        = http://localhost:3001
NEXTAUTH_SECRET     = dev-secret-change-in-production
GOOGLE_CLIENT_ID    = (from Google Cloud Console → Credentials)
GOOGLE_CLIENT_SECRET= (from Google Cloud Console → Credentials)
STRIPE_SECRET_KEY   = sk_test_51TCHh... (test key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_51TCHh...
STRIPE_WEBHOOK_SECRET = whsec_4510f68...
RESEND_API_KEY      = re_KoBAi3PX_...
EMAIL_FROM          = Omni Cartix <orders@omnicartix.co.uk>
NEXT_PUBLIC_APP_URL = http://localhost:3001
ADMIN_EMAIL         = admin@omnicartix.co.uk
```

**Not yet configured (skipped):**
- `PAYPAL_*` — skipped (requires +1 US phone for sandbox verification)
- `R2_*` — skipped (requires card on file for Cloudflare)

---

## Database

**Provider:** Supabase (PostgreSQL on AWS eu-west-2)
**Project ID:** `ndzucpxaodizfzgvuivv`

### Connection string notes
- Prisma CLI (`migrate`, `seed`) reads `.env` — NOT `.env.local`
- `.env` contains only DB URLs for Prisma CLI
- `.env.local` contains all vars for Next.js runtime
- Transaction pooler (port 6543) = `DATABASE_URL` — used at runtime
- Session pooler (port 5432) = `DIRECT_URL` — used for migrations (IPv4 compatible)
- Direct connection (db.xxx.supabase.co:5432) = NOT used — not IPv4 compatible from this network

### Migration status
- `prisma migrate dev` ran successfully — all tables created
- `prisma db seed` ran successfully — database is seeded

### Seed data
- 1 admin user
- 3 parent categories (Physical / Digital / SaaS)
- ~30 subcategories
- 50 products (mix of all three types)
- 3 coupons: `WELCOME10`, `DIGITAL20`, `SAAS15`
- 10 customer users
- 30 orders (mix of statuses)
- Reviews, download links, blog posts

### Admin login
```
Email:    admin@omnicartix.co.uk
Password: Admin123! (hashed with bcrypt in seed)
```

---

## Deployment

### Production URL
- **Live at:** `https://omnicartix.co.uk` (custom domain — fully connected ✅)
- **Vercel URL:** `https://omni-cartix.vercel.app` (still works as alias)
- GitHub repo: `https://github.com/yuvrajsabai23/omni-cartix.git` (branch: `master`)
- Vercel auto-deploys on every push to `master`

### Domain: omnicartix.co.uk
- Purchased from **Hostinger**
- DNS records configured in Hostinger:
  - `A` record: `@` → `216.198.79.1` (TTL 3600)
  - `CNAME` record: `www` → `eba46ff2accf88f0.vercel-dns-017.com.` (TTL 3600)
- Both `omnicartix.co.uk` and `www.omnicartix.co.uk` added and verified in Vercel

### Vercel Environment Variables (production)
- `NEXTAUTH_URL` = `https://omnicartix.co.uk`
- `NEXT_PUBLIC_APP_URL` = `https://omnicartix.co.uk`
- `NEXTAUTH_SECRET` = (random secret, set in Vercel)
- All other vars same as `.env.local`

---

## Services Setup Status

### ✅ Supabase (Database)
- Project: Omni Cartix
- Region: AWS eu-west-2
- Connection strings in both `.env` and `.env.local`

### ✅ Stripe
- Test mode keys saved in `.env.local` and Vercel
- Production webhook endpoint: `https://omni-cartix.vercel.app/api/webhooks/stripe`
- Production webhook name: `captivating-serenity` (in Stripe Workbench → Webhooks)
- `STRIPE_WEBHOOK_SECRET` updated in Vercel with production `whsec_` secret
- **Do NOT run local Stripe CLI** when testing on production — it's not needed
- Events: `checkout.session.completed`, `customer.subscription.created/updated/deleted`

### ✅ Resend (Email)
- API key saved in `.env.local` and Vercel
- From address: `orders@omnicartix.co.uk`
- **Action needed:** Verify domain `omnicartix.co.uk` in Resend dashboard (add DNS TXT records in Hostinger) before emails deliver

### ✅ Google OAuth
- Google Cloud project: "Omni Cartix"
- OAuth client type: Web application
- Authorized redirect URIs:
  - `http://localhost:3001/api/auth/callback/google` (local)
  - `https://omni-cartix.vercel.app/api/auth/callback/google` (production)
- Authorized JavaScript origins:
  - `http://localhost:3001`
  - `https://omni-cartix.vercel.app`
- App is in **Testing** mode — `yuvrajsabai23@gmail.com` added as test user
- **Action needed:** Add `https://omnicartix.co.uk` as JavaScript origin and `https://omnicartix.co.uk/api/auth/callback/google` as redirect URI

### ⏭️ PayPal (Skipped)
- Requires +1 US phone number for sandbox account verification
- Add later when available

### ⏭️ Cloudflare R2 (Skipped)
- Requires credit card on file
- Used for: storing digital product files, serving downloads via pre-signed URLs
- Add later when ready for digital product uploads

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (providers stack)
│   ├── globals.css
│   ├── (public)/                     # Public routes
│   │   ├── page.tsx                  # Homepage
│   │   ├── products/                 # Listing + detail pages
│   │   ├── categories/
│   │   ├── pricing/
│   │   ├── about/, contact/, blog/
│   │   ├── privacy/, terms/, returns/
│   ├── auth/                         # signin, signup, forgot-password
│   ├── cart/
│   ├── checkout/                     # + success + cancel
│   ├── dashboard/                    # Customer dashboard (5 sub-pages)
│   ├── admin/                        # Admin panel (6 sub-pages)
│   └── api/
│       ├── auth/[...nextauth]/       # NextAuth handler
│       ├── webhooks/stripe/          # Stripe webhook (order fulfillment)
│       ├── webhooks/paypal/
│       ├── checkout/stripe/
│       ├── checkout/paypal/
│       ├── downloads/[token]/        # Secure digital delivery
│       ├── products/
│       ├── reviews/
│       ├── search/
│       ├── upload/                   # R2 pre-signed upload URL
│       └── admin/
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── layout/                       # Navbar, Footer, Sidebars
│   ├── home/                         # Hero, FeaturedProducts, etc.
│   ├── products/                     # ProductCard, ProductGrid, filters
│   ├── cart/                         # CartDrawer, CartItem
│   ├── checkout/                     # Forms, payment components
│   ├── dashboard/
│   ├── admin/
│   └── shared/                       # CookieBanner, Pagination, etc.
├── lib/
│   ├── prisma.ts                     # Singleton Prisma client
│   ├── auth.ts                       # NextAuth config + callbacks
│   ├── stripe.ts                     # Stripe client
│   ├── paypal.ts                     # PayPal SDK
│   ├── r2.ts                         # Cloudflare R2 + pre-signed URLs
│   ├── resend.ts                     # Email send functions
│   ├── vat.ts                        # UK VAT calculations (Decimal.js)
│   ├── license.ts                    # License key generator
│   ├── download-token.ts
│   └── utils.ts                      # cn(), formatGBP(), slugify()
├── hooks/                            # useCart, useSearch, useDebounce
├── store/cartStore.ts                # Zustand cart (localStorage persist)
├── types/                            # index.ts, next-auth.d.ts, etc.
├── config/                           # site.ts, navigation.ts, categories.ts
└── emails/                           # React Email templates
    ├── OrderConfirmation.tsx
    ├── DownloadReady.tsx
    ├── PasswordReset.tsx
    ├── WelcomeEmail.tsx
    └── VATInvoice.tsx
prisma/
├── schema.prisma
├── seed.ts
└── migrations/
```

---

## Key Architectural Decisions

### Money
- All prices stored as `Decimal @db.Decimal(10, 2)` — NEVER Float
- Prices stored **ex-VAT**; VAT computed at checkout time
- UK VAT rate: 20% (standard)
- Stripe amounts in **pence**: `Math.round(price.mul(100).toNumber())`
- Display: "£X.XX ex. VAT" + "£X.XX inc. VAT"

### Auth
- Strategy: **JWT** (not database sessions) for edge compatibility
- Providers: Google OAuth + CredentialsProvider (email/password with bcrypt)
- Session extended with `id` and `role` via callbacks
- Admin role check: `session.user.role === 'ADMIN'`
- Middleware protects: `/dashboard/*`, `/admin/*`, `/checkout/*`

### Cart
- Zustand with `persist` + `skipHydration: true`
- `CartStoreHydrator` client component calls `rehydrate()` in `useEffect` to prevent SSR mismatch
- On login: merge localStorage cart with DB cart

### Digital Delivery
- Download tokens: `cuid()`, 24h expiry, max 3 downloads
- `GET /api/downloads/[token]` → verify → generate R2 pre-signed URL (5 min) → redirect
- File URL **never** exposed to client directly
- Prisma `$transaction` used when checking + incrementing download count (race condition prevention)

### Webhooks
- Raw body read as `req.text()` BEFORE any parsing
- Idempotency: check `order.status === 'PAID'` before processing
- `checkout.session.completed` → mark PAID → generate download links + license keys → send emails
- Email failures caught and logged — never break order fulfillment

### Database + Prisma
- `connection_limit=1` in DATABASE_URL (required for Supabase pooler)
- All seed operations are **sequential** (`for...of` loops, NOT `Promise.all`) to avoid P2024 timeout
- `postinstall: "prisma generate"` in package.json (required for Vercel deploys)

---

## Logo & Branding

### Logo file
- `public/logo.png` — transparent background PNG (must be exported with actual transparency, not checkered pattern baked in)
- Use `remove.bg` or Canva "transparent background" export to get proper transparency

### Logo placement
- **Hero section** (`src/components/home/HeroSection.tsx`): displayed above the badge/heading using plain `<img>` tag (NOT `next/image` — Next.js image optimization strips PNG transparency)
  ```tsx
  <img src="/logo.png" alt="Omni Cartix" className="h-64 w-auto object-contain drop-shadow-2xl" />
  ```
- **Navbar** (`src/components/layout/Navbar.tsx`): text-only — gradient "OC" icon box + "Omni Cartix" text (no image in navbar)
- **Favicon**: set in `src/app/layout.tsx` metadata `icons: { icon: "/logo.png", ... }`

### Why plain `<img>` in hero
`next/image` was causing a checkered pattern because it strips alpha transparency during optimization. Plain `<img>` tag preserves the PNG exactly. The `@next/next/no-img-element` ESLint warning is suppressed with a comment.

---

## Performance Fixes

### N+1 Query Fix (homepage + products page)
Both `src/app/page.tsx` and `src/app/products/page.tsx` previously called `prisma.review.aggregate()` once per product inside `Promise.all()`. With `connection_limit=1` on Supabase pooler, this exhausted the pool and caused P2024 timeout errors.

**Fix:** replaced with a single `prisma.review.groupBy()` call for all products:
```typescript
const productIds = products.map((p) => p.id);
const ratings = await prisma.review.groupBy({
  by: ["productId"],
  where: { productId: { in: productIds }, approved: true },
  _avg: { rating: true },
});
const ratingMap = Object.fromEntries(ratings.map((r) => [r.productId, r._avg.rating]));
```
Then map over products once to attach `averageRating` from `ratingMap`.

---

## Dev Server

- Port: **3001**
- Start command: `npx next dev -p 3001` (or `npm run dev` if no other process occupies 3001)
- URL: http://localhost:3001
- If port 3001 is taken by a previous Node process: use `powershell Stop-Process -Id <pid> -Force` to kill it, then restart

### To run Stripe webhooks locally
```bash
.\stripe.exe listen --forward-to localhost:3001/api/webhooks/stripe
```
Keep this running in a separate terminal while testing payments.

### Test card numbers (Stripe)
```
Success:  4242 4242 4242 4242  (any future date, any CVC)
Decline:  4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

---

## UK Compliance

- **VAT**: UK VAT registered, 20% standard rate, displayed ex-VAT + inc-VAT everywhere
- **Digital goods**: checkout waiver checkbox ("I confirm I want immediate access and waive 14-day cancellation right")
- **GDPR**: Cookie banner (granular consent), privacy policy, data retention notice
- **Returns**: 14-day right of withdrawal for physical goods; digital goods exempt after waiver
- **Company footer**: "Omni Cartix Ltd | Registered in England & Wales | Co. No. XXXXXXXX | VAT No. GBXXXXXXXXX"

---

## Deployment Plan (Vercel)

### Environment variables to add in Vercel dashboard
All vars from `.env.local` PLUS:
- `NEXTAUTH_URL` → your production domain
- `NEXT_PUBLIC_APP_URL` → your production domain
- `STRIPE_WEBHOOK_SECRET` → new secret from Vercel-specific Stripe webhook endpoint
- `NEXTAUTH_SECRET` → generate with `openssl rand -base64 32`

### Supabase for production
- Same DB (already has seeded data)
- Same connection strings work in Vercel

### Google OAuth for production
- Add production redirect URI in Google Cloud Console:
  `https://yourdomain.com/api/auth/callback/google`
- Move app from Testing → Production in Audience settings

### Stripe for production
- Create new webhook in Stripe dashboard → your Vercel URL → get new `whsec_` secret
- Switch to live keys when ready

---

## What's Left To Do

1. ✅ **Deploy to Vercel** — live at `https://omni-cartix.vercel.app`
2. ✅ **Stripe production webhook** — configured and working
3. ✅ **Google OAuth** — redirect URIs added for production
4. ✅ **Domain setup** — `omnicartix.co.uk` purchased, DNS configured, connected to Vercel
5. **Update Stripe webhook** — add new webhook for `https://omnicartix.co.uk/api/webhooks/stripe` and update `STRIPE_WEBHOOK_SECRET` in Vercel
6. **Update Google OAuth** — add `https://omnicartix.co.uk/api/auth/callback/google` as redirect URI and `https://omnicartix.co.uk` as JavaScript origin
7. **Verify domain in Resend** — add DNS TXT records in Hostinger to verify `omnicartix.co.uk` so emails deliver from `orders@omnicartix.co.uk`
8. **Verify Stripe account** — complete business verification to accept real payments
9. **Stripe live keys** — replace test keys (`sk_test_`, `pk_test_`) with live keys for real payments
10. **Add PayPal** — when +1 phone available, create sandbox account
11. **Add Cloudflare R2** — when card on file, create bucket for digital product files

## Known Bugs Fixed
- Unused `Image` import in Navbar caused Vercel build failure → removed
- TypeScript errors in `categories/[slug]/page.tsx` (`products` out of scope, missing `thumbnailUrl`, wrong `type` type) → fixed
- White Google button on signin/signup pages (shadcn `outline` variant has white bg) → fixed with `bg-transparent`
- Cart Order Summary showing £0.00 → Zustand persist getter bug, fixed by computing totals inline from `items`
- `NEXT_PUBLIC_APP_URL` was set to old preview URL `omni-cartix-i39a.vercel.app` → updated to `omni-cartix.vercel.app`
