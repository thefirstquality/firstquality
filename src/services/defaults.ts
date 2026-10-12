import type {
  SiteSettings,
  HeroSectionData,
  HeroBenefit,
  AboutSectionData,
  FeatureCard,
  StatisticItem,
  WhyChooseItem,
  ProductCategory,
  ProductItem,
  SourcingPhilosophyData,
  SourcingPillar,
  FarmVideoItem,
  TestimonialItem,
} from '@/types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: 'firstQuality',
  tagline: 'Fresh Vegetables, Better Living.',
  logo_url: '/images/logo.svg',
  phone: '+91 98765 43100',
  whatsapp_number: '919876543100',
  email: 'info@firstquality.in',
  address: 'Vyppinrick, Kerala, India',
  location_name: 'Kerala',
  instagram_url: 'https://instagram.com/firstquality',
  facebook_url: 'https://facebook.com/firstquality',
  youtube_url: 'https://youtube.com/firstquality',
  whatsapp_url: 'https://wa.me/919876543100',
  footer_description: 'Fresh vegetables, quality first. We work directly with local farmers to bring fresh and nutritious produce to homes, retailers and businesses across Kerala.',
  copyright_text: '© 2024 firstQuality. All rights reserved.',
};

export const DEFAULT_HERO: HeroSectionData = {
  badge: 'FRESH VEGETABLES, BETTER LIVING.',
  headline_line1: 'Fresh from',
  headline_line2: 'Local Farms',
  headline_highlight: 'to Your Table',
  description: 'firstQuality sources fresh vegetables directly from farmers in Kerala, ensuring better freshness, consistent quality and a reliable supply for homes, retailers and businesses.',
  primary_cta_text: 'Explore Our Products',
  primary_cta_url: '/products',
  secondary_cta_text: 'Business Enquiry',
  secondary_cta_url: '/enquiry',
  background_image_url: '/images/hero-farm-produce.jpg',
  is_published: true,
};

export const DEFAULT_HERO_BENEFITS: HeroBenefit[] = [
  { id: '1', title: 'Direct from', subtitle: 'Local Farms', icon_name: 'leaf', sort_order: 1 },
  { id: '2', title: 'Quality Checked', subtitle: 'Produce', icon_name: 'shield-check', sort_order: 2 },
  { id: '3', title: 'Retail & Wholesale', subtitle: 'Supply', icon_name: 'truck', sort_order: 3 },
  { id: '4', title: 'Supporting', subtitle: 'Local Farmers', icon_name: 'users', sort_order: 4 },
];

export const DEFAULT_ABOUT: AboutSectionData = {
  badge: 'ABOUT FIRSTQUALITY',
  heading: 'Committed to Freshness,\nQuality and Local Farmers',
  description: 'firstQuality is a Kerala-based vegetable sourcing and supply company that works directly with local farmers. We focus on practical farming practices, careful selection and consistent quality to serve households, retailers, restaurants and businesses with fresh vegetables every day.',
  cta_text: 'Know More About Us',
  cta_url: '/about',
  image_url: '/images/farmer-field.jpg',
  is_published: true,
};

export const DEFAULT_ABOUT_FEATURES: FeatureCard[] = [
  { id: '1', title: 'Farmer Partnerships', description: 'Direct sourcing from local farms', icon_name: 'leaf', sort_order: 1 },
  { id: '2', title: 'Quality Selection', description: 'Strict quality checks at every step', icon_name: 'shield-check', sort_order: 2 },
  { id: '3', title: 'Sustainable Practices', description: 'Guiding farmers for better cultivation', icon_name: 'sprout', sort_order: 3 },
  { id: '4', title: 'Reliable Supply', description: 'For retail, wholesale and business needs', icon_name: 'truck', sort_order: 4 },
];

export const DEFAULT_STATISTICS: StatisticItem[] = [
  { id: '1', number_value: '500+', label: 'Happy Customers', sublabel: 'Homes, retailers & businesses', icon_name: 'users', sort_order: 1 },
  { id: '2', number_value: '50+', label: 'Local Farmers', sublabel: 'Direct partnerships', icon_name: 'sprout', sort_order: 2 },
  { id: '3', number_value: 'Daily Supply', label: 'Fresh produce every day', sublabel: '', icon_name: 'truck', sort_order: 3 },
  { id: '4', number_value: 'Kerala', label: 'Serving local communities', sublabel: '', icon_name: 'map-pin', sort_order: 4 },
];

export const DEFAULT_WHY_CHOOSE: WhyChooseItem[] = [
  { id: '1', title: 'Fresh Produce', description: 'Carefully selected for better taste and nutrition.', icon_name: 'leaf', sort_order: 1 },
  { id: '2', title: 'Quality First', description: 'Strict quality control from farm to supply.', icon_name: 'shield-check', sort_order: 2 },
  { id: '3', title: 'Support Local Farmers', description: 'Direct partnerships and fair practices.', icon_name: 'users', sort_order: 3 },
  { id: '4', title: 'Reliable Supply', description: 'Consistent supply for retail, wholesale and business needs.', icon_name: 'truck', sort_order: 4 },
];

export const DEFAULT_CATEGORIES: ProductCategory[] = [];

export const DEFAULT_PRODUCTS: ProductItem[] = [];

export const DEFAULT_SOURCING: SourcingPhilosophyData = {
  heading: 'Our Sourcing Philosophy',
  description: 'We believe in practical quality, real safety and strong farmer relationships. Instead of marketing buzzwords, we focus on direct sourcing, field supervision and sustainable farming practices.',
  cta_text: 'Read Our Story',
  cta_url: '/about',
  is_published: true,
};

export const DEFAULT_SOURCING_PILLARS: SourcingPillar[] = [
  { id: '1', title: 'Field Staff Supervised', description: 'Our team visits fields to inspect and select only prime produce.', icon_name: 'user-check', sort_order: 1 },
  { id: '2', title: 'Good Farming Practices', description: 'We guide farmers towards safe, clean and sustainable cultivation.', icon_name: 'leaf', sort_order: 2 },
  { id: '3', title: 'Direct Farmer Partnership', description: 'Empowering local growers with technical advisory and direct market access.', icon_name: 'handshake', sort_order: 3 },
];

export const DEFAULT_FARM_VIDEOS: FarmVideoItem[] = [
  {
    id: 'v-1',
    title: 'Harvesting Fresh Vegetables',
    duration: '0:45',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: '/images/farm-harvesting.jpg',
    is_featured: true,
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'v-2',
    title: 'Harvesting Fresh Vegetables',
    duration: '0:45',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: '/images/farm-tomatoes.jpg',
    is_featured: false,
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'v-3',
    title: 'From Farm to Packing',
    duration: '0:32',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: '/images/farm-packing.jpg',
    is_featured: false,
    sort_order: 3,
    is_published: true,
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    customer_name: 'Restaurant Owner',
    role: 'Restaurant Owner',
    location: 'Thrissur, Kerala',
    quote: 'We have been sourcing vegetables from firstQuality for our restaurant. The quality and freshness are always consistent. Their team is very professional and reliable.',
    avatar_url: '/images/testimonial-avatar.jpg',
    sort_order: 1,
    is_published: true,
  },
];
