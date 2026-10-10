import React from 'react';

export function HeroSkeleton() {
  return (
    <div className="min-h-[85vh] pt-36 pb-12 bg-gray-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="w-48 h-4 bg-emerald-100 rounded" />
        <div className="w-3/4 max-w-lg h-12 bg-gray-200 rounded-lg" />
        <div className="w-1/2 max-w-md h-12 bg-gray-200 rounded-lg" />
        <div className="w-full max-w-xl h-20 bg-gray-100 rounded-lg" />
        <div className="flex gap-4 pt-4">
          <div className="w-40 h-12 bg-emerald-200 rounded-lg" />
          <div className="w-36 h-12 bg-gray-200 rounded-lg" />
        </div>
        <div className="mt-16 w-full h-24 bg-white rounded-2xl border border-gray-200/60" />
      </div>
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <div className="py-20 bg-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 aspect-[4/3] bg-gray-200 rounded-2xl" />
          <div className="lg:col-span-7 space-y-4">
            <div className="w-36 h-4 bg-emerald-100 rounded" />
            <div className="w-3/4 h-8 bg-gray-200 rounded" />
            <div className="w-full h-20 bg-gray-100 rounded" />
            <div className="w-40 h-10 bg-emerald-200 rounded-lg" />
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl p-4 space-y-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg" />
              <div className="w-3/4 h-4 bg-gray-200 rounded" />
              <div className="w-full h-3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="py-16 bg-[#0b2f1f] animate-pulse">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-emerald-900 rounded-full" />
            <div className="w-20 h-8 bg-emerald-800 rounded" />
            <div className="w-28 h-4 bg-emerald-900 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductsSkeleton() {
  return (
    <div className="py-20 bg-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="w-48 h-8 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden space-y-3 p-4">
              <div className="aspect-[4/3] bg-gray-200 rounded-xl" />
              <div className="w-3/4 h-5 bg-gray-200 rounded" />
              <div className="w-full h-10 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FarmsSkeleton() {
  return (
    <div className="py-20 bg-gray-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="w-56 h-8 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 aspect-[16/10] bg-gray-200 rounded-2xl" />
          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-[16/9] bg-gray-200 rounded-2xl" />
            <div className="aspect-[16/9] bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSkeleton() {
  return (
    <div className="py-24 bg-gray-100 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-lg bg-white rounded-2xl p-8 space-y-4">
          <div className="w-8 h-8 bg-emerald-100 rounded" />
          <div className="w-full h-16 bg-gray-200 rounded" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
            <div className="space-y-1">
              <div className="w-32 h-4 bg-gray-200 rounded" />
              <div className="w-20 h-3 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-gray-100 rounded-lg w-full" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center px-4 justify-between">
          <div className="w-1/3 h-4 bg-gray-200 rounded" />
          <div className="w-1/4 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-8 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
