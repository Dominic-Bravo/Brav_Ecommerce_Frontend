'use client';

import { useState } from 'react';
import type { Product } from '@/api/generated/models/product';
import { ProductCard } from './ProductCard';

type TabType = 'featured' | 'bestsellers' | 'new';

interface FeaturedProductsSectionProps {
  products?: Product[];
  isLoading?: boolean;
}

// Sample mock data conforming to Orval `Product` interface
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    category: 'cat-03',
    category_name: 'Technology',
    name: 'Brav Soundscape ANC Headphones',
    slug: 'brav-soundscape-anc-headphones',
    description: 'Precision engineered active noise cancelling over-ear wireless headphones.',
    price: '299.00',
    sku: 'TECH-SND-01',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    images: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'prod-02',
    category: 'cat-01',
    category_name: 'Clothes',
    name: 'Heavyweight Minimalist Hoodie',
    slug: 'heavyweight-minimalist-hoodie',
    description: '450gsm organic cotton loopback French terry hoodie.',
    price: '145.00',
    sku: 'CLTH-HD-02',
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    images: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'prod-03',
    category: 'cat-02',
    category_name: 'Accessories',
    name: 'Full-Grain Leather Cardholder',
    slug: 'full-grain-leather-cardholder',
    description: 'Vegetable-tanned Italian leather slim pocket wallet.',
    price: '65.00',
    sku: 'ACC-WLT-03',
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    images: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'prod-04',
    category: 'cat-03',
    category_name: 'Technology',
    name: 'Precision Aluminum Desk Stand',
    slug: 'precision-aluminum-desk-stand',
    description: 'Anodized CNC machined aluminum laptop stand.',
    price: '89.00',
    sku: 'TECH-STD-04',
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    images: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export function FeaturedProductsSection({
  products = MOCK_PRODUCTS,
  isLoading = false,
}: FeaturedProductsSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('featured');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'featured', label: 'Featured Products' },
    { id: 'bestsellers', label: 'Best Sellers' },
    { id: 'new', label: 'New Arrivals' },
  ];

  return (
    <section className="w-full bg-brav-white py-16 lg:py-24 border-b border-brav-border">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & Subsections Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-brav-border gap-6">
          <div className="space-y-1">
            <span className="text-xs font-sans font-semibold tracking-wider text-brav-gold uppercase">
              Handpicked Essentials
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-brav-charcoal tracking-tight">
              Discover Craft & Innovation
            </h2>
          </div>

          {/* Subsections Navigation Tabs */}
          <div className="flex items-center gap-2 bg-brav-surface p-1 rounded-xl border border-brav-border self-start md:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-sans font-semibold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-brav-charcoal text-brav-white shadow-sm'
                    : 'text-brav-muted hover:text-brav-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-brav-surface border border-brav-border animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                discountPrice={idx === 0 ? '249.00' : undefined}
                onAddToCart={(p) => console.log('Added to cart:', p.name)}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}