# Omni Cartix — Build Checklist

Last updated: 2026-03-18

---

## Phase 1 — Project Scaffold
- [x] Next.js 14 app created (TypeScript, Tailwind, ESLint, App Router, src dir)
- [x] All npm dependencies installed
- [x] shadcn/ui initialized (Zinc theme, CSS variables)
- [x] shadcn/ui components added (button, card, dialog, input, table, tabs, etc.)

## Phase 2 — Project Structure
- [x] Full `src/` directory tree created (all routes, components, lib, store, types, config)
- [x] All API routes scaffolded
- [x] All page routes scaffolded

## Phase 3 — Configuration Files
- [x] `tailwind.config.ts` — custom colors (primary indigo, accent cyan, dark #0F172A)
- [x] `next.config.ts` — image remote patterns, server actions body size limit
- [x] `.env.local` — all environment variables set
- [x] `.env` — Prisma CLI database URLs (separate from .env.local)
- [x] `vercel.json` — function timeout config (webhooks 60s, checkout 30s)

## Phase 4 — Prisma Schema
- [x] `prisma/schema.prisma` — all models defined
- [x] User, Account, Session, VerificationToken (NextAuth)
- [x] Category (with self-relation for subcategories)
- [x] Product (PHYSICAL / DIGITAL / SAAS types, Decimal prices)
- [x] Order + OrderItem (with price snapshots)
- [x] DownloadLink (token, expiry, download count)
- [x] LicenseKey (OMNI-XXXX-XXXX-XXXX-XXXX format)
- [x] Review (verifiedPurchase, approved flag)
- [x] Coupon (percentage + fixed discount types)
- [x] Subscription (Stripe subscription sync)
- [x] BlogPost
- [x] `prisma migrate dev` — migration ran successfully, all tables created in Supabase
- [x] `prisma db seed` — seed ran successfully (50 products, 10 customers, 30 orders, etc.)

## Phase 5 — Auth (NextAuth)
- [x] `src/lib/auth.ts` — NextAuth config with JWT strategy
- [x] Google OAuth provider
- [x] CredentialsProvider (email + bcrypt password)
- [x] Session/JWT callbacks extend user with `id` and `role`
- [x] `src/types/next-auth.d.ts` — session type augmented
- [x] `POST /api/auth/register` — signup route
- [x] `POST /api/auth/forgot-password` — password reset request
- [x] `POST /api/auth/reset-password` — password reset handler
- [x] `src/middleware.ts` — protects `/dashboard/*`, `/admin/*`, `/checkout/*`

## Phase 6 — Core Layout
- [x] Root `layout.tsx` — provider stack (SessionProvider, ThemeProvider, Zustand hydrator)
- [x] `Navbar.tsx` — links, search, cart icon, user menu, mobile sheet
- [x] `Footer.tsx` — UK company details, payment icons, legal links
- [x] `DashboardSidebar.tsx`
- [x] `AdminSidebar.tsx`
- [x] `globals.css` — base styles
- [x] `error.tsx` + `not-found.tsx`

## Phase 7 — Homepage
- [x] `HeroSection.tsx` — full viewport dark hero with gradient heading + dual CTA
- [x] `TrustBadges.tsx` — 5 trust badges (secure payments, UK registered, etc.)
- [x] `CategoryGrid.tsx` — 3 category cards (Physical / Digital / SaaS)
- [x] `FeaturedProducts.tsx` — server-fetched featured product cards
- [x] `HowItWorks.tsx` — 3-step process
- [x] `Testimonials.tsx` — 3 testimonial quotes
- [x] `NewsletterSection.tsx` — email signup
- [x] Homepage `page.tsx` — all sections composed with Suspense + skeletons

## Phase 8 — Products & Categories
- [x] `/products` — listing page with server-side filters (category, type, price, sort, search, page)
- [x] `/products/[slug]` — product detail with ISR, image gallery, reviews, add to cart
- [x] `/categories` — category listing
- [x] `/categories/[slug]` — category detail with products
- [x] `ProductCard.tsx` — thumbnail, badges, price (ex-VAT + inc-VAT), add to cart
- [x] `ProductGrid.tsx`
- [x] `ProductFilters.tsx` — sidebar filters
- [x] `StarRating.tsx`

## Phase 9 — Cart (Zustand)
- [x] `src/store/cartStore.ts` — Zustand with localStorage persist + skipHydration
- [x] Cart hydrator in root layout (avoids SSR mismatch)
- [x] `CartDrawer.tsx` — slide-out cart
- [x] `CartItem.tsx`
- [x] `CartSummary.tsx` — subtotal ex-VAT, VAT, total inc-VAT
- [x] `/cart` page

## Phase 10 — Checkout Flow
- [x] `/checkout` — multi-step checkout page
- [x] Address form (UK fields: line1, line2, city, county, postcode)
- [x] Coupon code input → `POST /api/coupons/validate`
- [x] Digital goods waiver checkbox
- [x] `/checkout/success` — order confirmation page
- [x] `/checkout/cancel` — cancelled payment page

## Phase 11 — Stripe Integration
- [x] `src/lib/stripe.ts` — Stripe client
- [x] `POST /api/checkout/stripe` — creates Stripe Checkout Session
- [x] `POST /api/webhooks/stripe` — handles all events (idempotent)
  - [x] `checkout.session.completed` → mark PAID, create download links, send emails
  - [x] `customer.subscription.*` → sync Subscription table
  - [x] `invoice.payment_succeeded` → send receipt email
  - [x] `charge.refunded` → mark REFUNDED
- [x] Stripe test keys configured in `.env.local`
- [x] Stripe CLI (`stripe.exe`) downloaded to project root
- [x] Webhook secret configured in `.env.local`

## Phase 12 — PayPal Integration
- [x] `src/lib/paypal.ts` — PayPal SDK helper
- [x] `POST /api/checkout/paypal/create-order`
- [x] `POST /api/checkout/paypal/capture-order`
- [x] `POST /api/webhooks/paypal`
- [ ] **PayPal sandbox credentials** — SKIPPED (requires +1 US phone for verification)

## Phase 13 — Digital Delivery
- [x] `src/lib/r2.ts` — Cloudflare R2 client + pre-signed URL generator
- [x] `GET /api/downloads/[token]` — secure download handler (verify → pre-sign → redirect)
- [x] `POST /api/upload` — admin pre-signed PUT URL for R2 upload
- [x] `src/lib/license.ts` — license key generator (OMNI-XXXX-XXXX-XXXX-XXXX)
- [ ] **Cloudflare R2 bucket credentials** — SKIPPED (requires card on file)

## Phase 14 — UK VAT
- [x] `src/lib/vat.ts` — `calcVAT()`, `formatGBP()` using Decimal.js
- [x] All prices displayed ex-VAT + inc-VAT throughout
- [x] `VATBreakdown` component in checkout

## Phase 15 — Email System (Resend + React Email)
- [x] `src/lib/resend.ts` — Resend client + send functions
- [x] Resend API key configured in `.env.local`
- [x] `src/emails/` directory created
- [ ] `OrderConfirmation.tsx` — email template
- [ ] `DownloadReady.tsx` — email template
- [ ] `WelcomeEmail.tsx` — email template
- [ ] `PasswordReset.tsx` — email template
- [ ] `VATInvoice.tsx` — email template

## Phase 16 — Customer Dashboard
- [x] `/dashboard` — overview stats
- [x] `/dashboard/orders` — order history
- [x] `/dashboard/downloads` — download cards with time remaining
- [x] `/dashboard/subscriptions` — subscription management
- [x] `/dashboard/licenses` — license key display
- [x] `/dashboard/profile` — update name, address, marketing consent

## Phase 17 — Admin Panel
- [x] `/admin` — dashboard with revenue chart, stats cards
- [x] `/admin/products` — product table + CRUD
- [x] `/admin/products/new` — product creation form
- [x] `/admin/products/[id]` — product edit form
- [x] `/admin/orders` — order management
- [x] `/admin/orders/[id]` — order detail + status update
- [x] `/admin/customers` — customer list
- [x] `/admin/categories` — category management
- [x] `/admin/analytics` — revenue + conversion charts
- [x] `/admin/settings`
- [x] Double auth check in admin layout (session + role === 'ADMIN')

## Phase 18 — Reviews
- [x] `POST /api/reviews` — submit review (verified purchase check)
- [x] Review display with aggregate rating on product page
- [x] Admin approval flow

## Phase 19 — Search & Filters
- [x] `GET /api/search` — full-text search using PostgreSQL tsvector
- [x] URL-state only filters on `/products`
- [x] Debounced search input hook (`src/hooks/useDebounce.ts`)

## Phase 20 — Legal Pages & GDPR
- [x] `/privacy` — UK GDPR Article 13 notice
- [x] `/terms` — English law, England & Wales jurisdiction
- [x] `/returns` — 14-day withdrawal rights + digital goods waiver
- [x] `CookieBanner.tsx` — granular consent (Necessary, Analytics, Marketing)
- [x] Digital goods waiver checkbox at checkout

## Phase 21 — Seed Data
- [x] `prisma/seed.ts` — comprehensive seed script
- [x] Seed ran successfully (all Promise.all replaced with sequential for...of loops)
- [x] Admin user: `admin@omnicartix.co.uk` / `Admin123!`
- [x] 50 products, 10 customers, 30 orders, coupons, reviews, blog posts

## Phase 22 — SEO & Extras
- [x] `src/app/robots.ts`
- [x] `src/app/sitemap.ts`
- [x] `/blog` + `/blog/[slug]`
- [x] `/pricing`
- [x] `/about`
- [x] `/contact`

---

## Services Status

| Service | Status | Notes |
|---------|--------|-------|
| Supabase (DB) | ✅ Connected | Migrated + seeded |
| Stripe | ✅ Configured | Test keys + webhook secret |
| Resend (Email) | ✅ Configured | Domain verification needed for delivery |
| Google OAuth | ✅ Configured | Add your Gmail as test user in Google Cloud |
| PayPal | ⏭️ Skipped | Needs +1 US phone for sandbox |
| Cloudflare R2 | ⏭️ Skipped | Needs card on file |

---

## Remaining Tasks

### Must do before testing
- [ ] Add your Gmail as a test user: Google Cloud Console → Audience → Test users
- [ ] Restart dev server (`Ctrl+C` then `npm run dev`)

### Email templates (not yet written)
- [ ] `src/emails/OrderConfirmation.tsx`
- [ ] `src/emails/DownloadReady.tsx`
- [ ] `src/emails/WelcomeEmail.tsx`
- [ ] `src/emails/PasswordReset.tsx`
- [ ] `src/emails/VATInvoice.tsx`

### Local testing
- [ ] Sign in with Google OAuth
- [ ] Sign in with email + password (`admin@omnicartix.co.uk` / `Admin123!`)
- [ ] Browse products, add to cart, verify cart persists on refresh
- [ ] Complete Stripe test checkout (card: `4242 4242 4242 4242`)
- [ ] Verify order confirmation email received (via Resend)
- [ ] Test download link from dashboard
- [ ] Verify admin panel loads and shows data

### Deployment (Vercel)
- [ ] Push code to GitHub (`git init` → `git push`)
- [ ] Connect GitHub repo in Vercel dashboard
- [ ] Add all env vars in Vercel (same as `.env.local` + production values)
- [ ] Change `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- [ ] Create new Stripe webhook endpoint for Vercel URL → get new `STRIPE_WEBHOOK_SECRET`
- [ ] Add production redirect URI in Google Cloud Console
- [ ] Move Google OAuth app from Testing → Production (Google Cloud → Audience)
- [ ] Run `npx prisma migrate deploy` against production DB (or it auto-runs on Vercel build)

### After deployment
- [ ] Verify domain `omnicartix.co.uk` in Resend (for email delivery)
- [ ] Point domain DNS to Vercel
- [ ] Add Cloudflare R2 credentials (when ready for digital products)
- [ ] Add PayPal sandbox credentials (when +1 phone available)
- [ ] Switch Stripe to live keys when going live
- [ ] Register with ICO (UK GDPR requirement)
- [ ] Register for UK VAT (if not already)
- [ ] Add real company registration number and VAT number to footer
