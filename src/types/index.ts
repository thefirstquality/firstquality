export interface SiteSettings {
  id?: string;
  site_name: string;
  tagline?: string;
  logo_url: string;
  logo_public_id?: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  location_name: string;
  instagram_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  whatsapp_url?: string;
  footer_description?: string;
  copyright_text?: string;
  updated_at?: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  is_active: boolean;
}

export interface HeroSectionData {
  id?: string;
  badge: string;
  headline_line1: string;
  headline_line2: string;
  headline_highlight: string;
  description: string;
  primary_cta_text: string;
  primary_cta_url: string;
  secondary_cta_text: string;
  secondary_cta_url: string;
  background_image_url: string;
  background_public_id?: string;
  is_published: boolean;
}

export interface HeroPopupVideoItem {
  id?: string;
  title: string;
  duration?: string;
  video_url: string;
  thumbnail_url?: string;
  thumbnail_public_id?: string;
  description?: string;
  is_featured?: boolean;
  is_published?: boolean;
}

export interface HeroBenefit {
  id: string;
  title: string;
  subtitle?: string;
  icon_name: string;
  icon_url?: string;
  icon_public_id?: string;
  sort_order: number;
}

export interface AboutSectionData {
  id?: string;
  badge: string;
  heading: string;
  description: string;
  cta_text: string;
  cta_url: string;
  image_url: string;
  image_public_id?: string;
  is_published: boolean;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  icon_url?: string;
  icon_public_id?: string;
  sort_order: number;
}

export interface StatisticItem {
  id: string;
  number_value: string;
  label: string;
  sublabel: string;
  icon_name: string;
  icon_url?: string;
  icon_public_id?: string;
  sort_order: number;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  icon_url?: string;
  icon_public_id?: string;
  sort_order: number;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  short_description?: string;
  full_description?: string;
  image_url: string;
  image_public_id?: string;
  sort_order: number;
  is_published: boolean;
}

export interface ProductItem {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  image_public_id?: string;
  unit: string;
  price_text?: string;
  in_stock: boolean;
  sort_order: number;
  is_published: boolean;
}

export interface SourcingPhilosophyData {
  id?: string;
  heading: string;
  description: string;
  cta_text: string;
  cta_url: string;
  is_published: boolean;
}

export interface SourcingPillar {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  icon_url?: string;
  icon_public_id?: string;
  sort_order: number;
}

export interface FarmVideoItem {
  id: string;
  title: string;
  duration: string;
  video_url: string;
  thumbnail_url: string;
  thumbnail_public_id?: string;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
}

export interface TestimonialItem {
  id: string;
  customer_name: string;
  role: string;
  location: string;
  quote: string;
  avatar_url: string;
  avatar_public_id?: string;
  sort_order: number;
  is_published: boolean;
}

export interface BusinessEnquiry {
  id: string;
  full_name: string;
  business_name?: string;
  phone: string;
  email: string;
  enquiry_type: 'retail' | 'wholesale' | 'export' | 'restaurant' | 'household' | 'farmer' | 'other';
  message: string;
  status: 'new' | 'contacted' | 'resolved' | 'archived';
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface SeoMetadata {
  id?: string;
  route_path: string;
  page_title: string;
  meta_description: string;
  keywords?: string;
  og_image_url?: string;
  canonical_url?: string;
}
