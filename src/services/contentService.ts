import { createServerSupabaseClient } from '@/lib/supabase/server';
import type {
  SiteSettings,
  HeroSectionData,
  HeroBenefit,
  AboutSectionData,
  FeatureCard,
  StatisticItem,
  WhyChooseItem,
  ProductCategory,
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
  DEFAULT_SOURCING,
  DEFAULT_SOURCING_PILLARS,
  DEFAULT_FARM_VIDEOS,
  DEFAULT_TESTIMONIALS,
} from './defaults';

export * from './defaults';

// Helper functions for content retrieval (Server-side)
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return DEFAULT_SITE_SETTINGS;

  try {
    const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
    if (error || !data) return DEFAULT_SITE_SETTINGS;
    return data;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getHeroSection(): Promise<HeroSectionData> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return DEFAULT_HERO;

  try {
    const { data, error } = await supabase.from('hero_section').select('*').eq('is_published', true).limit(1).single();
    if (error || !data) return DEFAULT_HERO;
    return data;
  } catch {
    return DEFAULT_HERO;
  }
}

export async function getHeroBenefits(): Promise<HeroBenefit[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return DEFAULT_HERO_BENEFITS;

  try {
    const { data, error } = await supabase.from('hero_benefits').select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_HERO_BENEFITS;
    return data;
  } catch {
    return DEFAULT_HERO_BENEFITS;
  }
}

export async function getAboutSection(): Promise<AboutSectionData> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return DEFAULT_ABOUT;

  try {
    const { data, error } = await supabase.from('about_section').select('*').eq('is_published', true).limit(1).single();
    if (error || !data) return DEFAULT_ABOUT;
    return data;
  } catch {
    return DEFAULT_ABOUT;
  }
}

export async function getAboutFeatures(): Promise<FeatureCard[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return DEFAULT_ABOUT_FEATURES;

  try {
    const { data, error } = await supabase.from('about_features').select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_ABOUT_FEATURES;
    return data;
  } catch {
    return DEFAULT_ABOUT_FEATURES;
  }
}

export async function getStatistics(): Promise<StatisticItem[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return DEFAULT_STATISTICS;

  try {
    const { data, error } = await supabase.from('statistics').select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_STATISTICS;
    return data;
  } catch {
    return DEFAULT_STATISTICS;
  }
}

export async function getWhyChooseItems(): Promise<WhyChooseItem[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return DEFAULT_WHY_CHOOSE;

  try {
    const { data, error } = await supabase.from('why_choose_items').select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_WHY_CHOOSE;
    return data;
  } catch {
    return DEFAULT_WHY_CHOOSE;
  }
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  const supabase = await createServerSupabaseClient();
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

export async function getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  const categories = await getProductCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function getSourcingPhilosophy(): Promise<SourcingPhilosophyData> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return DEFAULT_SOURCING;

  try {
    const { data, error } = await supabase.from('sourcing_philosophy').select('*').eq('is_published', true).limit(1).single();
    if (error || !data) return DEFAULT_SOURCING;
    return data;
  } catch {
    return DEFAULT_SOURCING;
  }
}

export async function getSourcingPillars(): Promise<SourcingPillar[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return DEFAULT_SOURCING_PILLARS;

  try {
    const { data, error } = await supabase.from('sourcing_pillars').select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_SOURCING_PILLARS;
    return data;
  } catch {
    return DEFAULT_SOURCING_PILLARS;
  }
}

export async function getFarmVideos(): Promise<FarmVideoItem[]> {
  const supabase = await createServerSupabaseClient();
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

export async function getTestimonials(): Promise<TestimonialItem[]> {
  const supabase = await createServerSupabaseClient();
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
