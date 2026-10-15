import React from 'react';
import {
  getSiteSettings,
  getHeroSection,
  getHeroBenefits,
  getAboutSection,
  getAboutFeatures,
  getStatistics,
  getWhyChooseItems,
  getProductCategories,
  getProducts,
  getFarmVideos,
  getTestimonials,
} from '@/services/contentService';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { parseHeroPopupVideos } from '@/services/heroVideoService';
import { AboutSection } from '@/components/home/AboutSection';
import { StatsBanner } from '@/components/home/StatsBanner';
import { WhyChooseSection } from '@/components/home/WhyChooseSection';
import { ProductsSection } from '@/components/home/ProductsSection';
import { SourcingSection } from '@/components/home/SourcingSection';
import { FarmsSection } from '@/components/home/FarmsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CtaBanner } from '@/components/home/CtaBanner';

export const instant = false;

export default async function HomePage() {
  const [
    settings,
    hero,
    benefits,
    about,
    features,
    stats,
    whyChoose,
    categories,
    products,
    videos,
    testimonials,
  ] = await Promise.all([
    getSiteSettings(),
    getHeroSection(),
    getHeroBenefits(),
    getAboutSection(),
    getAboutFeatures(),
    getStatistics(),
    getWhyChooseItems(),
    getProductCategories(),
    getProducts(),
    getFarmVideos(),
    getTestimonials(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header enquireUrl="/enquiry" />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero Section & Benefits */}
        <HeroSection
          data={hero}
          benefits={benefits}
          heroVideos={parseHeroPopupVideos(hero.secondary_cta_url, hero.secondary_cta_text)}
        />

        {/* 2. About Section & Feature Cards */}
        <AboutSection data={about} features={features} />

        {/* 3. Statistics Banner */}
        <StatsBanner stats={stats} />

        {/* 4. Why Choose firstQuality */}
        <WhyChooseSection items={whyChoose} />

        {/* 5. Our Products Section */}
        <ProductsSection
          products={products}
          categories={categories}
          whatsappNumber={settings.whatsapp_number}
        />

        {/* 6. Our Sourcing Philosophy - built directly into code */}
        <SourcingSection />

        {/* 7. Our Farms Section */}
        <FarmsSection videos={videos} />

        {/* 8. Customer Testimonials */}
        {/* <TestimonialsSection testimonials={testimonials} /> */}

        {/* 9. Business Enquiry CTA Banner */}
        <CtaBanner
          whatsappNumber={settings.whatsapp_number}
          whatsappUrl={settings.whatsapp_url}
        />
      </main>

      {/* Footer */}
      <Footer settings={settings} />
    </div>
  );
}
