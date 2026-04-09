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

-- Activity Logs (for admin dashboard)
create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  action text not null,
  resource_type text,
  resource_id text,
  details jsonb,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table messages enable row level security;

-- RLS Policies for profiles
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- RLS Policies for products
create policy "Anyone can view approved products" on products
  for select using (status = 'approved');

create policy "Sellers can view their own products" on products
  for select using (auth.uid() = seller_id);

create policy "Sellers can insert products" on products
  for insert with check (auth.uid() = seller_id);

create policy "Sellers can update their own products" on products
  for update using (auth.uid() = seller_id);

create policy "Sellers can delete their own products" on products
  for delete using (auth.uid() = seller_id);

create policy "Admins can view all products" on products
  for select using (
    exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update any product" on products
  for update using (
    exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- RLS Policies for orders
create policy "Users can view their own orders" on orders
  for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Admins can view all orders" on orders
  for select using (
    exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- RLS Policies for messages
create policy "Users can view messages for their orders" on messages
  for select using (
    exists(
      select 1 from orders
      where id = messages.order_id
      and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );

create policy "Users can insert messages for their orders" on messages
  for insert with check (
    auth.uid() = sender_id
    and exists(
      select 1 from orders
      where id = order_id
      and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );
