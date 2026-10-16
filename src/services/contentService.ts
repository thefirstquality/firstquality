import { unstable_cache } from 'next/cache';
import { getPublicSupabase } from '@/lib/supabase/public';
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
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_HERO,
  DEFAULT_HERO_BENEFITS,
  DEFAULT_ABOUT,
  DEFAULT_ABOUT_FEATURES,
  DEFAULT_STATISTICS,
  DEFAULT_WHY_CHOOSE,
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_SOURCING,
  DEFAULT_SOURCING_PILLARS,
  DEFAULT_FARM_VIDEOS,
  DEFAULT_TESTIMONIALS,
} from './defaults';

export * from './defaults';

// 1. Site Settings (Cached)
async function fetchSiteSettingsRaw(): Promise<SiteSettings> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_SITE_SETTINGS;
  try {
    const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
    if (error || !data) return DEFAULT_SITE_SETTINGS;
    return data;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
export const getSiteSettings = unstable_cache(fetchSiteSettingsRaw, ['site-settings'], {
  tags: ['content', 'site_settings', 'settings'],
  revalidate: 3600,
});

// 2. Hero Section (Cached)
async function fetchHeroSectionRaw(): Promise<HeroSectionData> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_HERO;
  try {
    const { data, error } = await supabase.from('hero_section').select('*').eq('is_published', true).limit(1).single();
    if (error || !data) return DEFAULT_HERO;
    return data;
  } catch {
    return DEFAULT_HERO;
  }
}
export const getHeroSection = unstable_cache(fetchHeroSectionRaw, ['hero-section'], {
  tags: ['content', 'hero_section'],
  revalidate: 3600,
});

// 3. Hero Benefits (Cached)
async function fetchHeroBenefitsRaw(): Promise<HeroBenefit[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_HERO_BENEFITS;
  try {
    const { data, error } = await supabase.from('hero_benefits').select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_HERO_BENEFITS;
    return data;
  } catch {
    return DEFAULT_HERO_BENEFITS;
  }
}
export const getHeroBenefits = unstable_cache(fetchHeroBenefitsRaw, ['hero-benefits'], {
  tags: ['content', 'hero_benefits'],
  revalidate: 3600,
});

// 4. About Section (Cached)
async function fetchAboutSectionRaw(): Promise<AboutSectionData> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_ABOUT;
  try {
    const { data, error } = await supabase.from('about_section').select('*').eq('is_published', true).limit(1).single();
    if (error || !data) return DEFAULT_ABOUT;
    return data;
  } catch {
    return DEFAULT_ABOUT;
  }
}
export const getAboutSection = unstable_cache(fetchAboutSectionRaw, ['about-section'], {
  tags: ['content', 'about_section'],
  revalidate: 3600,
});

// 5. About Features (Cached)
async function fetchAboutFeaturesRaw(): Promise<FeatureCard[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_ABOUT_FEATURES;
  try {
    const { data, error } = await supabase.from('about_features').select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_ABOUT_FEATURES;
    return data;
  } catch {
    return DEFAULT_ABOUT_FEATURES;
  }
}
export const getAboutFeatures = unstable_cache(fetchFeaturesRaw, ['about-features'], {
  tags: ['content', 'about_features'],
  revalidate: 3600,
});
async function fetchFeaturesRaw(): Promise<FeatureCard[]> {
  return fetchAboutFeaturesRaw();
}

// 6. Statistics (Cached)
async function fetchStatisticsRaw(): Promise<StatisticItem[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_STATISTICS;
  try {
    const { data, error } = await supabase.from('statistics').select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_STATISTICS;
    return data;
  } catch {
    return DEFAULT_STATISTICS;
  }
}
export const getStatistics = unstable_cache(fetchStatisticsRaw, ['statistics'], {
  tags: ['content', 'statistics'],
  revalidate: 3600,
});

// 7. Why Choose Items (Cached)
async function fetchWhyChooseItemsRaw(): Promise<WhyChooseItem[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_WHY_CHOOSE;
  try {
    const { data, error } = await supabase.from('why_choose_items').select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_WHY_CHOOSE;
    return data;
  } catch {
    return DEFAULT_WHY_CHOOSE;
  }
}
export const getWhyChooseItems = unstable_cache(fetchWhyChooseItemsRaw, ['why-choose-items'], {
  tags: ['content', 'why_choose_items'],
  revalidate: 3600,
});

// 8. Product Categories (Cached)
async function fetchProductCategoriesRaw(): Promise<ProductCategory[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_CATEGORIES;
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_CATEGORIES;
    return data;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}
export const getProductCategories = unstable_cache(fetchProductCategoriesRaw, ['product-categories'], {
  tags: ['content', 'product_categories', 'categories'],
  revalidate: 3600,
});

// 9. Products (Cached)
async function fetchProductsRaw(): Promise<ProductItem[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_PRODUCTS;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_PRODUCTS;
    return data;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}
export const getProducts = unstable_cache(fetchProductsRaw, ['products'], {
  tags: ['content', 'products'],
  revalidate: 3600,
});

// Derived helpers based on cached products and categories
export async function getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  const categories = await getProductCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function getProductsByCategory(categoryIdentifier: string): Promise<ProductItem[]> {
  const allProducts = await getProducts();
  const allCategories = await getProductCategories();

  const matchedCat = allCategories.find(
    (c) => c.id === categoryIdentifier || c.slug === categoryIdentifier
  );

  if (!matchedCat) {
    return allProducts.filter((p) => p.category_id === categoryIdentifier);
  }

  return allProducts.filter(
    (p) => p.category_id === matchedCat.id || p.category_id === matchedCat.slug
  );
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

// 10. Sourcing Philosophy & Pillars (Cached)
async function fetchSourcingPhilosophyRaw(): Promise<SourcingPhilosophyData> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_SOURCING;
  try {
    const { data, error } = await supabase.from('sourcing_philosophy').select('*').eq('is_published', true).limit(1).single();
    if (error || !data) return DEFAULT_SOURCING;
    return data;
  } catch {
    return DEFAULT_SOURCING;
  }
}
export const getSourcingPhilosophy = unstable_cache(fetchSourcingPhilosophyRaw, ['sourcing-philosophy'], {
  tags: ['content', 'sourcing_philosophy'],
  revalidate: 3600,
});

async function fetchSourcingPillarsRaw(): Promise<SourcingPillar[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_SOURCING_PILLARS;
  try {
    const { data, error } = await supabase.from('sourcing_pillars').select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_SOURCING_PILLARS;
    return data;
  } catch {
    return DEFAULT_SOURCING_PILLARS;
  }
}
export const getSourcingPillars = unstable_cache(fetchSourcingPillarsRaw, ['sourcing-pillars'], {
  tags: ['content', 'sourcing_pillars'],
  revalidate: 3600,
});

// 11. Farm Videos (Cached)
async function fetchFarmVideosRaw(): Promise<FarmVideoItem[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_FARM_VIDEOS;
  try {
    const { data, error } = await supabase
      .from('farm_videos')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_FARM_VIDEOS;
    return data;
  } catch {
    return DEFAULT_FARM_VIDEOS;
  }
}
export const getFarmVideos = unstable_cache(fetchFarmVideosRaw, ['farm-videos'], {
  tags: ['content', 'farm_videos'],
  revalidate: 3600,
});

// 12. Testimonials (Cached)
async function fetchTestimonialsRaw(): Promise<TestimonialItem[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return DEFAULT_TESTIMONIALS;
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_TESTIMONIALS;
    return data;
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}
export const getTestimonials = unstable_cache(fetchTestimonialsRaw, ['testimonials'], {
  tags: ['content', 'testimonials'],
  revalidate: 3600,
});
