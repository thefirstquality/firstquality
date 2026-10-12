-- firstQuality Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Site Settings
create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  site_name text not null default 'firstQuality',
  tagline text default 'Fresh Vegetables, Better Living.',
  logo_url text default '/images/logo.svg',
  logo_public_id text,
  phone text default '+91 98765 43100',
  whatsapp_number text default '919876543100',
  email text default 'info@firstquality.in',
  address text default 'Vyppinrick, Kerala, India',
  location_name text default 'Kerala',
  instagram_url text default 'https://instagram.com/firstquality',
  facebook_url text default 'https://facebook.com/firstquality',
  youtube_url text default 'https://youtube.com/firstquality',
  whatsapp_url text default 'https://wa.me/919876543100',
  footer_description text default 'Fresh vegetables, quality first. We work directly with local farmers to bring fresh and nutritious produce to homes, retailers and businesses across Kerala.',
  copyright_text text default '© 2024 firstQuality. All rights reserved.',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Hero Section
create table if not exists hero_section (
  id uuid primary key default uuid_generate_v4(),
  badge text not null default 'FRESH VEGETABLES, BETTER LIVING.',
  headline_line1 text not null default 'Fresh from',
  headline_line2 text not null default 'Local Farms',
  headline_highlight text not null default 'to Your Table',
  description text not null default 'firstQuality sources fresh vegetables directly from farmers in Kerala, ensuring better freshness, consistent quality and a reliable supply for homes, retailers and businesses.',
  primary_cta_text text not null default 'Explore Our Products',
  primary_cta_url text not null default '/products',
  secondary_cta_text text not null default 'Business Enquiry',
  secondary_cta_url text not null default '/enquiry',
  background_image_url text not null default '/images/hero-farm-produce.jpg',
  background_public_id text,
  is_published boolean default true not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Hero Benefits
create table if not exists hero_benefits (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  icon_name text not null default 'leaf',
  icon_url text,
  icon_public_id text,
  sort_order int default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. About Section
create table if not exists about_section (
  id uuid primary key default uuid_generate_v4(),
  badge text not null default 'ABOUT FIRSTQUALITY',
  heading text not null default 'Committed to Freshness, Quality and Local Farmers',
  description text not null default 'firstQuality is a Kerala-based vegetable sourcing and supply company that works directly with local farmers. We focus on practical farming practices, careful selection and consistent quality to serve households, retailers, restaurants and businesses with fresh vegetables every day.',
  cta_text text not null default 'Know More About Us',
  cta_url text not null default '/about',
  image_url text not null default '/images/farmer-field.jpg',
  image_public_id text,
  is_published boolean default true not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. About Feature Cards
create table if not exists about_features (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon_name text not null default 'leaf',
  icon_url text,
  icon_public_id text,
  sort_order int default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Statistics
create table if not exists statistics (
  id uuid primary key default uuid_generate_v4(),
  number_value text not null,
  label text not null,
  sublabel text not null,
  icon_name text not null default 'users',
  icon_url text,
  icon_public_id text,
  sort_order int default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Why Choose Items
create table if not exists why_choose_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon_name text not null default 'leaf',
  icon_url text,
  icon_public_id text,
  sort_order int default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Product Categories
create table if not exists product_categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  short_description text default '',
  full_description text,
  image_url text not null,
  image_public_id text,
  sort_order int default 0 not null,
  is_published boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Products
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references product_categories(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text not null,
  image_url text not null,
  image_public_id text,
  unit text not null default '1 kg',
  price_text text,
  in_stock boolean default true not null,
  sort_order int default 0 not null,
  is_published boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Sourcing Philosophy
create table if not exists sourcing_philosophy (
  id uuid primary key default uuid_generate_v4(),
  heading text not null default 'Our Sourcing Philosophy',
  description text not null default 'We believe in practical quality, real safety and strong farmer relationships. Instead of marketing buzzwords, we focus on direct sourcing, field supervision and sustainable farming practices.',
  cta_text text not null default 'Read Our Story',
  cta_url text not null default '/about',
  is_published boolean default true not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Sourcing Pillars
create table if not exists sourcing_pillars (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon_name text not null default 'user-check',
  icon_url text,
  icon_public_id text,
  sort_order int default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Farm Videos
create table if not exists farm_videos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  duration text not null default '0:45',
  video_url text not null default 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  thumbnail_url text not null default '/images/farm-harvesting.jpg',
  thumbnail_public_id text,
  is_featured boolean default false not null,
  sort_order int default 0 not null,
  is_published boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. Testimonials
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  role text not null,
  location text not null,
  quote text not null,
  avatar_url text not null default '/images/testimonial-avatar.jpg',
  avatar_public_id text,
  sort_order int default 0 not null,
  is_published boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. Enquiries
create table if not exists enquiries (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  business_name text,
  phone text not null,
  email text not null,
  enquiry_type text not null default 'wholesale',
  message text not null,
  status text not null default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 15. Newsletter Subscribers
create table if not exists newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 16. SEO Metadata
create table if not exists seo_metadata (
  id uuid primary key default uuid_generate_v4(),
  route_path text unique not null,
  page_title text not null,
  meta_description text not null,
  keywords text,
  og_image_url text,
  canonical_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on all tables
alter table site_settings enable row level security;
alter table hero_section enable row level security;
alter table hero_benefits enable row level security;
alter table about_section enable row level security;
alter table about_features enable row level security;
alter table statistics enable row level security;
alter table why_choose_items enable row level security;
alter table product_categories enable row level security;
alter table products enable row level security;
alter table sourcing_philosophy enable row level security;
alter table sourcing_pillars enable row level security;
alter table farm_videos enable row level security;
alter table testimonials enable row level security;
alter table enquiries enable row level security;
alter table newsletter_subscribers enable row level security;
alter table seo_metadata enable row level security;

-- Public Read Policies
create policy "Allow public read site_settings" on site_settings for select using (true);
create policy "Allow public read hero_section" on hero_section for select using (is_published = true);
create policy "Allow public read hero_benefits" on hero_benefits for select using (true);
create policy "Allow public read about_section" on about_section for select using (is_published = true);
create policy "Allow public read about_features" on about_features for select using (true);
create policy "Allow public read statistics" on statistics for select using (true);
create policy "Allow public read why_choose_items" on why_choose_items for select using (true);
create policy "Allow public read product_categories" on product_categories for select using (is_published = true);
create policy "Allow public read products" on products for select using (is_published = true);
create policy "Allow public read sourcing_philosophy" on sourcing_philosophy for select using (is_published = true);
create policy "Allow public read sourcing_pillars" on sourcing_pillars for select using (true);
create policy "Allow public read farm_videos" on farm_videos for select using (is_published = true);
create policy "Allow public read testimonials" on testimonials for select using (is_published = true);
create policy "Allow public read seo_metadata" on seo_metadata for select using (true);

-- Public Insert Policies for Enquiries & Newsletter
create policy "Allow public insert enquiries" on enquiries for insert with check (true);
create policy "Allow public insert newsletter" on newsletter_subscribers for insert with check (true);

-- Authenticated Admin Policies (Full Access)
create policy "Allow admin all site_settings" on site_settings for all using (auth.role() = 'authenticated');
create policy "Allow admin all hero_section" on hero_section for all using (auth.role() = 'authenticated');
create policy "Allow admin all hero_benefits" on hero_benefits for all using (auth.role() = 'authenticated');
create policy "Allow admin all about_section" on about_section for all using (auth.role() = 'authenticated');
create policy "Allow admin all about_features" on about_features for all using (auth.role() = 'authenticated');
create policy "Allow admin all statistics" on statistics for all using (auth.role() = 'authenticated');
create policy "Allow admin all why_choose_items" on why_choose_items for all using (auth.role() = 'authenticated');
create policy "Allow admin all product_categories" on product_categories for all using (auth.role() = 'authenticated');
create policy "Allow admin all products" on products for all using (auth.role() = 'authenticated');
create policy "Allow admin all sourcing_philosophy" on sourcing_philosophy for all using (auth.role() = 'authenticated');
create policy "Allow admin all sourcing_pillars" on sourcing_pillars for all using (auth.role() = 'authenticated');
create policy "Allow admin all farm_videos" on farm_videos for all using (auth.role() = 'authenticated');
create policy "Allow admin all testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "Allow admin all enquiries" on enquiries for all using (auth.role() = 'authenticated');
create policy "Allow admin all newsletter" on newsletter_subscribers for all using (auth.role() = 'authenticated');
create policy "Allow admin all seo_metadata" on seo_metadata for all using (auth.role() = 'authenticated');
