# SecondHeat — Static Prototype → Production Architecture

## Project Overview

SecondHeat is a C2C marketplace for second-hand dance clothes. This is a **static prototype** using hardcoded mock data, but every data layer has a clear abstraction boundary so Supabase, Vercel, and optionally Sanity can be dropped in later without restructuring.

The client approves this prototype visually. Then we swap static data for live data — **no redesign needed**.

---

## Static → Dynamic Migration Plan

### 1. Data Access Layer (DAL)

All data flows through `/lib/data/` — never import mock data directly in components.

**Current state:** Functions return mock data from `/lib/mock/`
**To migrate:** Replace function bodies with Supabase queries

```typescript
// lib/data/products.ts
export async function getProducts(): Promise<Product[]> {
  // TODO: Replace with Supabase query
  // const { data } = await supabase.from('products').select('*').eq('status', 'approved')
  return mockProducts.filter((p) => p.status === 'approved')
}
```

**Migration steps:**
1. Initialize Supabase project
2. Run `/supabase/schema.sql` in Supabase SQL editor
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
4. Replace each DAL function body with a Supabase query
5. No component changes needed

### 2. Authentication Context

**Current state:** `/lib/auth/context.tsx` returns a hardcoded mock user via `MOCK_ROLE` env var
**To migrate:** Replace with Supabase Auth

```typescript
// lib/auth/context.tsx
export function useAuth(): AuthContextType {
  // TODO: Replace with Supabase Auth
  return {
    user: mockUser,
    isMember: true,
    signIn: async () => {},
    signOut: async () => {},
  }
}
```

**Migration steps:**
1. Install `@supabase/ssr`
2. Replace `useAuth()` internals with Supabase Auth hooks
3. All components using `useAuth()` stay untouched

### 3. Content Layer (Editorial Pages)

**Current state:** `/lib/content/index.ts` returns mock content
**To migrate:** Connect Sanity CMS

```typescript
// lib/content/index.ts
export async function getPage(slug: string): Promise<PageContent | null> {
  // TODO: Replace with Sanity query
  // return await sanityClient.fetch(pageQuery, { slug })
  return mockPages[slug] || null
}
```

**Migration steps:**
1. Create Sanity project at sanity.io
2. Add `NEXT_PUBLIC_SANITY_PROJECT_ID` env var
3. Uncomment `/sanity/lib/sanityClient.ts`
4. Replace mock returns with Sanity queries
5. Pages using `getPage()` stay untouched

### 4. Payments (Stripe)

**Current state:** Checkout buttons are UI-only placeholders
**To migrate:** Add real Stripe payments

**Files:** `/app/shop/[id]/page.tsx` and any checkout component
**Migration:** Replace mock "Buy now" button with `stripe.redirectToCheckout()`

### 5. Shipping Labels (Bring/PostNord)

**Current state:** Admin dashboard has "Generate label" button that logs to console
**To migrate:** Add Bring API integration

```typescript
// lib/data/admin.ts
export async function triggerShippingLabel(orderId: string): Promise<string> {
  // TODO: Replace with Bring/PostNord API call
  return `https://example.com/labels/${orderId}.pdf`
}
```

---

## Switching Roles in Prototype

Use the `NEXT_PUBLIC_MOCK_ROLE` environment variable:

```bash
# See as buyer (default)
NEXT_PUBLIC_MOCK_ROLE=buyer npm run dev

# See as seller
NEXT_PUBLIC_MOCK_ROLE=seller npm run dev

# See as admin
NEXT_PUBLIC_MOCK_ROLE=admin npm run dev
```

This switches which mock user is logged in, affecting:
- Dashboard routes (`/dashboard/buyer` vs `/dashboard/seller`)
- Admin routes (`/admin/*` visible only with role=admin)
- Navbar links and visible actions

---

## Folder Structure

```
/
├── app/                           (Next.js App Router pages)
│   ├── page.tsx                   (landing)
│   ├── login/page.tsx
│   ├── join/page.tsx
│   ├── shop/
│   │   ├── page.tsx               (listings)
│   │   └── [id]/page.tsx          (detail)
│   ├── sell/page.tsx              (seller: submit product)
│   ├── dashboard/
│   │   ├── seller/page.tsx
│   │   └── buyer/page.tsx
│   ├── messages/[orderId]/page.tsx
│   ├── admin/
│   │   ├── page.tsx               (dashboard)
│   │   ├── approvals/page.tsx
│   │   ├── members/page.tsx
│   │   └── orders/page.tsx
│   ├── how-it-works/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/                        (shadcn/ui components)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── ProductForm.tsx
│   ├── admin/
│   │   ├── ApprovalCard.tsx
│   │   └── AdminStats.tsx
│   └── messages/
│       └── MessageThread.tsx
├── lib/
│   ├── data/                      (DAL — swap mock for Supabase here)
│   │   ├── products.ts
│   │   ├── sellers.ts
│   │   ├── orders.ts
│   │   ├── messages.ts
│   │   ├── members.ts
│   │   └── admin.ts
│   ├── mock/                      (static prototype data)
│   │   ├── products.ts
│   │   ├── sellers.ts
│   │   ├── orders.ts
│   │   ├── messages.ts
│   │   └── content.ts
│   ├── auth/
│   │   └── context.tsx            (mock auth → Supabase Auth later)
│   ├── content/
│   │   └── index.ts               (mock content → Sanity later)
│   ├── types/
│   │   └── index.ts               (shared types)
│   └── utils.ts
├── sanity/                        (dormant, ready to activate)
│   ├── sanity.config.ts
│   ├── lib/
│   │   └── sanityClient.ts
│   └── schemas/
│       ├── product.ts
│       ├── page.ts
│       └── faq.ts
├── supabase/
│   └── schema.sql                 (ready to run when going live)
├── .env.example
├── vercel.json
└── CLAUDE.md
```

---

## Supabase Schema (Ready to Run)

See `/supabase/schema.sql` — contains tables for:
- `profiles` (users with role: buyer | seller | admin)
- `products` (listings with status: pending | approved | rejected | sold)
- `orders` (buyer-seller transactions)
- `messages` (buyer-seller communication per order)

Copy and paste into Supabase SQL editor when ready to go live.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values as you integrate services:

```
# Always needed (prototype only)
NEXT_PUBLIC_MOCK_ROLE=buyer

# Supabase (when going live)
NEXT_PUBLIC_SUPABASE_URL=<project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Stripe (when adding payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<pk_test_...>
STRIPE_SECRET_KEY=<sk_test_...>
STRIPE_WEBHOOK_SECRET=<whsec_...>

# Bring (when adding shipping labels)
BRING_API_KEY=<key>
BRING_API_UID=<uid>

# Sanity (if using CMS for editorial content)
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
NEXT_PUBLIC_SANITY_DATASET=production
```

---

## Design System

- **Color accent:** Dusty rose (#b8907d and variants)
- **Headings:** Playfair Display (serif)
- **UI text:** DM Sans (sans-serif)
- **Component library:** shadcn/ui (all UI primitives)
- **Styling:** Tailwind CSS with custom color palette

Override shadcn defaults in component files to match the dusty rose aesthetic.

---

## Migration Checklist

### Phase 1: Client approval (current)
- [x] Static prototype with mock data
- [x] All pages interactive
- [ ] Client approves design and flow

### Phase 2: Supabase & Auth
- [ ] Create Supabase project
- [ ] Run `/supabase/schema.sql`
- [ ] Set env vars
- [ ] Migrate `/lib/data/*` functions to Supabase queries
- [ ] Migrate `/lib/auth/context.tsx` to Supabase Auth
- [ ] Test auth flow end-to-end

### Phase 3: Payments
- [ ] Create Stripe account
- [ ] Set env vars
- [ ] Implement `/api/checkout` endpoint
- [ ] Replace mock "Buy now" buttons with real Stripe

### Phase 4: Shipping (optional)
- [ ] Get Bring API credentials
- [ ] Implement `/api/shipping/label` endpoint
- [ ] Replace mock label generation

### Phase 5: CMS (optional)
- [ ] Create Sanity project
- [ ] Set up schemas in `/sanity/schemas/`
- [ ] Deploy Sanity studio
- [ ] Migrate `/lib/content/index.ts` to Sanity queries

---

## Development

```bash
# Install dependencies
npm install

# Run prototype
npm run dev

# View as different role
NEXT_PUBLIC_MOCK_ROLE=seller npm run dev
NEXT_PUBLIC_MOCK_ROLE=admin npm run dev

# Build for production
npm run build
npm run start
```

---

## Key Architectural Rules

1. **Never import mock data directly in components** — always go through `/lib/data/`
2. **Auth context `useAuth()` is the single source of truth** — no ad-hoc auth checks
3. **All data returns are typed** — enables safe Supabase migration later
4. **Env vars control prototype behavior** — `MOCK_ROLE` switches user, future vars control live service connections
5. **No hardcoded URLs or service keys** — everything is env-based

---

## Notes for Future Dev

- **Sanity schemas** in `/sanity/schemas/` are templates — fill in field names and validation as needed
- **Row-level security** in Supabase should be enabled once auth is live — see commented lines in schema.sql
- **Vercel deployment** uses Stockholm region (arn1) by default — configured in vercel.json
- **Image optimization** is configured for picsum.photos (mock) — add your own domain when live
