import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettings, getFarmVideos } from '@/services/contentService';
import { FarmsSection } from '@/components/home/FarmsSection';

export const metadata: Metadata = {
  title: 'Our Partner Farms in Kerala | firstQuality',
  description:
    'Explore our network of local Kerala farms, view authentic harvesting footage, and understand our ethical farmer partnerships.',
};

export default async function FarmsPage() {
  const [settings, videos] = await Promise.all([
    getSiteSettings(),
    getFarmVideos(),
  ]);

  const farmClusters = [
    {
      region: 'Thrissur & Palakkad Plains',
      crops: 'Ash gourd, Snake gourd, Bitter gourd, Brinjals, Okra, String beans',
      farmers: '24+ Certified Growers',
      description: 'Lush fertile agricultural belt producing crisp gourds, greens, and nutrient-dense local varieties under warm tropical sunshine.',
    },
    {
      region: 'Wayanad & Idukki Highlands',
      crops: 'Cool-climate vegetables: Cabbage, Carrots, Cauliflower, Potatoes, Beetroot',
      farmers: '18+ High-altitude Farmers',
      description: 'Cool mountain elevations providing pesticide-conscious organic cultivation and slow-maturing sweet root vegetables.',
    },
    {
      region: 'Central Kerala River Basin',
      crops: 'Tapioca, Plantain (Nendran), Colocasia, Yam, Leafy Amaranth (Cheera)',
      farmers: '12+ Traditional Cultivators',
      description: 'Riverbed alluvium soil delivering traditional Kerala heritage tubers and tender daily cut greens.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 pt-28">
        {/* Banner */}
        <div className="py-16 bg-gradient-to-b from-[#eaf6ee] to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
              OUR FARMS & HARVESTING
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
              Real Farms. Real People. Real Work.
            </h1>
            <div className="w-14 h-1 bg-[#f97316] rounded-full mb-4" />
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              We take pride in absolute transparency. Meet the hands that cultivate your food and watch genuine field footage from our partnering farms across Kerala.
            </p>
          </div>
        </div>

        {/* Video Gallery Section */}
        <FarmsSection videos={videos} />

        {/* Partner Farm Clusters */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider">
                REGIONAL SOURCING CLUSTERS
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                Where Our Vegetables Grow
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                We partner strategically with diverse micro-climates across Kerala to ensure year-round availability of staple and specialty vegetables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {farmClusters.map((cluster, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl border border-gray-100 bg-[#fbfdfb] hover:shadow-xl transition-all"
                >
                  <div className="text-xs font-bold text-[#15803d] uppercase tracking-wider mb-2">
                    {cluster.farmers}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{cluster.region}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {cluster.description}
                  </p>
                  <div className="pt-4 border-t border-gray-200/60">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                      Key Crops:
                    </span>
                    <span className="text-xs text-gray-800 font-medium">{cluster.crops}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Farm Partnership Banner */}
            <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-[#0b2f1f] text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">Are You a Kerala Vegetable Farmer?</h3>
                <p className="text-emerald-100/90 text-sm max-w-xl">
                  We offer direct farmgate purchase, prompt payments, and technical guidance on sustainable cultivation practices.
                </p>
              </div>
              <Link
                href="/enquiry?type=farmer"
                className="px-8 py-3.5 rounded-xl text-sm font-bold text-[#0b2f1f] bg-white hover:bg-emerald-50 transition-all flex-shrink-0"
              >
                Join Farmer Network
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
