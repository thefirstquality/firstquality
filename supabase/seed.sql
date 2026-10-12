-- Seed Data for firstQuality matching Reference Images 1 & 2

-- Site Settings
insert into site_settings (
  site_name, tagline, logo_url, phone, whatsapp_number, email, address, location_name,
  instagram_url, facebook_url, youtube_url, whatsapp_url, footer_description, copyright_text
) values (
  'firstQuality',
  'Fresh Vegetables, Better Living.',
  '/images/logo.svg',
  '+91 98765 43100',
  '919876543100',
  'info@firstquality.in',
  'Vyppinrick, Kerala, India',
  'Kerala',
  'https://instagram.com/firstquality',
  'https://facebook.com/firstquality',
  'https://youtube.com/firstquality',
  'https://wa.me/919876543100',
  'Fresh vegetables, quality first. We work directly with local farmers to bring fresh and nutritious produce to homes, retailers and businesses across Kerala.',
  '© 2024 firstQuality. All rights reserved.'
) on conflict do nothing;

-- Hero Section
insert into hero_section (
  badge, headline_line1, headline_line2, headline_highlight, description,
  primary_cta_text, primary_cta_url, secondary_cta_text, secondary_cta_url,
  background_image_url, is_published
) values (
  'FRESH VEGETABLES, BETTER LIVING.',
  'Fresh from',
  'Local Farms',
  'to Your Table',
  'firstQuality sources fresh vegetables directly from farmers in Kerala, ensuring better freshness, consistent quality and a reliable supply for homes, retailers and businesses.',
  'Explore Our Products',
  '/products',
  'Business Enquiry',
  '/enquiry',
  '/images/hero-farm-produce.jpg',
  true
) on conflict do nothing;

-- Hero Benefits (4 items)
insert into hero_benefits (title, icon_name, sort_order) values
('Direct from Local Farms', 'leaf', 1),
('Quality Checked Produce', 'shield-check', 2),
('Retail & Wholesale Supply', 'truck', 3),
('Supporting Local Farmers', 'users', 4)
on conflict do nothing;

-- About Section
insert into about_section (
  badge, heading, description, cta_text, cta_url, image_url, is_published
) values (
  'ABOUT FIRSTQUALITY',
  'Committed to Freshness, Quality and Local Farmers',
  'firstQuality is a Kerala-based vegetable sourcing and supply company that works directly with local farmers. We focus on practical farming practices, careful selection and consistent quality to serve households, retailers, restaurants and businesses with fresh vegetables every day.',
  'Know More About Us',
  '/about',
  '/images/farmer-field.jpg',
  true
) on conflict do nothing;

-- About Features (4 cards)
insert into about_features (title, description, icon_name, sort_order) values
('Farmer Partnerships', 'Direct sourcing from local farms', 'leaf', 1),
('Quality Selection', 'Strict quality checks at every step', 'shield-check', 2),
('Sustainable Practices', 'Guiding farmers for better cultivation', 'sprout', 3),
('Reliable Supply', 'For retail, wholesale and business needs', 'truck', 4)
on conflict do nothing;

-- Statistics (4 items)
insert into statistics (number_value, label, sublabel, icon_name, sort_order) values
('500+', 'Happy Customers', 'Homes, retailers & businesses', 'users', 1),
('50+', 'Local Farmers', 'Direct partnerships', 'sprout', 2),
('Daily Supply', 'Fresh produce every day', 'Daily Supply', 'truck', 3),
('Kerala', 'Serving local communities', 'Kerala', 'map-pin', 4)
on conflict do nothing;

-- Why Choose Items (4 items)
insert into why_choose_items (title, description, icon_name, sort_order) values
('Fresh Produce', 'Carefully selected for better taste and nutrition.', 'leaf', 1),
('Quality First', 'Strict quality control from farm to supply.', 'shield-check', 2),
('Support Local Farmers', 'Direct partnerships and fair practices.', 'users', 3),
('Reliable Supply', 'Consistent supply for retail, wholesale and business needs.', 'truck', 4)
on conflict do nothing;

-- Sourcing Philosophy
insert into sourcing_philosophy (heading, description, cta_text, cta_url, is_published) values (
  'Our Sourcing Philosophy',
  'We believe in practical quality, real safety and strong farmer relationships. Instead of marketing buzzwords, we focus on direct sourcing, field supervision and sustainable farming practices.',
  'Read Our Story',
  '/about',
  true
) on conflict do nothing;

-- Sourcing Pillars (3 cards)
insert into sourcing_pillars (title, description, icon_name, sort_order) values
('Field Staff Supervised', 'Our team visits fields to inspect and select only prime produce.', 'user-check', 1),
('Good Farming Practices', 'We guide farmers towards safe, clean and sustainable cultivation.', 'leaf', 2),
('Direct Farmer Partnership', 'Empowering local growers with technical advisory and direct market access.', 'handshake', 3)
on conflict do nothing;

-- Farm Videos (3 items)
insert into farm_videos (title, duration, video_url, thumbnail_url, is_featured, sort_order, is_published) values
('Harvesting Fresh Vegetables', '0:45', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '/images/farm-harvesting.jpg', true, 1, true),
('Harvesting Fresh Vegetables', '0:45', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '/images/farm-tomatoes.jpg', false, 2, true),
('From Farm to Packing', '0:32', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '/images/farm-packing.jpg', false, 3, true)
on conflict do nothing;

-- Testimonials
insert into testimonials (customer_name, role, location, quote, avatar_url, sort_order, is_published) values
('Restaurant Owner', 'Restaurant Owner', 'Thrissur, Kerala', 'We have been sourcing vegetables from firstQuality for our restaurant. The quality and freshness are always consistent. Their team is very professional and reliable.', '/images/testimonial-avatar.jpg', 1, true)
on conflict do nothing;

-- SEO Metadata
insert into seo_metadata (route_path, page_title, meta_description) values
('/', 'firstQuality | Fresh from Local Farms to Your Table', 'Kerala-based fresh vegetable sourcing and supply company connecting local farmers with households, retailers, restaurants, and wholesale businesses.'),
('/about', 'About Us | firstQuality Kerala', 'Committed to freshness, quality, and empowering local Kerala farmers with ethical sourcing and reliable supply chains.'),
('/products', 'Our Fresh Produce Catalog | firstQuality', 'Explore farm-fresh vegetables, fresh-cut ready to cook veggies, combo kits, and daily kitchen essentials in Kerala.'),
('/farms', 'Our Farms & Fields | firstQuality', 'Take a look inside our partnered Kerala farms, harvesting methods, and authentic field footage.'),
('/contact', 'Contact Us | firstQuality', 'Get in touch for daily home deliveries, retail distributions, and wholesale supply partnerships in Kerala.'),
('/enquiry', 'Business Enquiry | firstQuality', 'Request quotations for restaurant, hotel, caterer, or retail wholesale supply of fresh Kerala vegetables.')
on conflict do nothing;
