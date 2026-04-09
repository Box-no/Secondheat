# Supabase Setup Guide

## Step 1: Install Dependencies

Run this command to install the Supabase client:

```bash
npm install
```

## Step 2: Create Database Tables

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste this SQL:

```sql
-- Profiles / Users
create table profiles (
  id uuid references auth.users primary key,
  name text,
  email text,
  role text default 'buyer',
  is_member boolean default false,
  member_since timestamptz,
  avatar_url text,
  created_at timestamptz default now()
);

-- Products listed by sellers
create table products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id),
  title text not null,
  description text,
  price numeric not null,
  size text,
  category text,
  condition text,
  images text[],
  status text default 'pending',
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  buyer_id uuid references profiles(id),
  seller_id uuid references profiles(id),
  amount numeric not null,
  status text default 'paid',
  shipping_label_url text,
  stripe_payment_intent text,
  created_at timestamptz default now()
);

-- Messages (per order)
create table messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  sender_id uuid references profiles(id),
  content text not null,
  created_at timestamptz default now()
);
```

5. Click **Run** (blue play button)

## Step 3: Get Your API Keys

1. In Supabase, go to **Project Settings** → **API**
2. Copy these values:
   - `Project URL` (this is your SUPABASE_URL)
   - `anon public` key (this is your SUPABASE_ANON_KEY)

## Step 4: Set Environment Variables

Create or update `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Start the Dev Server

```bash
npm run dev
```

That's it! The app will now use Supabase for:
- **Products** - Getting products, filtering, creating listings
- **Orders** - Order history and tracking
- **Messages** - Buyer-seller communication
- **Sellers/Profiles** - User information

## Fallback Behavior

If Supabase isn't configured, the app will automatically use mock data. This means you can:
- Continue testing with mock data while setting up Supabase
- Switch seamlessly between mock and live data by adding/removing env variables
- Have a working prototype without any backend setup

## Adding More Data

To add real sellers and orders to Supabase:

1. Go to **SQL Editor** and insert sample data:

```sql
-- Insert a test seller profile
insert into profiles (id, name, email, role, is_member, member_since, avatar_url)
values (
  gen_random_uuid(),
  'Emma Lundgren',
  'emma@example.com',
  'seller',
  true,
  now(),
  'https://picsum.photos/100/100?random=1'
);

-- Insert a test product
insert into products (seller_id, title, description, price, size, category, condition, images, status)
values (
  (select id from profiles where email = 'emma@example.com' limit 1),
  'Elegant Black Leotard',
  'Classic black leotard, perfect for ballet classes.',
  299,
  'M',
  'top',
  'like_new',
  ARRAY['https://picsum.photos/500/600?random=101', 'https://picsum.photos/500/600?random=102'],
  'approved'
);
```

## Troubleshooting

**"Supabase client not available"** → Your environment variables aren't set. Add them to `.env.local` and restart the dev server.

**"Permission denied"** → Your Supabase Row Level Security policies need adjustment. For now, go to **Authentication** in Supabase and ensure your tables don't have RLS enabled (or adjust policies if they do).

**Still seeing mock data?** → Restart your dev server after adding env vars: `npm run dev`

## Next Steps

Once you have data in Supabase:
1. Set up authentication (Supabase Auth)
2. Enable Row Level Security for data privacy
3. Add Stripe for payments
4. Set up shipping label generation

For more details, see `CLAUDE.md` in the project root.
