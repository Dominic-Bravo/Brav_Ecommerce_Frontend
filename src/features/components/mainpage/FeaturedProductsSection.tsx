'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import type { Product } from '@/api/generated/models/product';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/hooks/products/useProducts';

interface FeaturedProductsSectionProps {
  products?: Product[];
  isLoading?: boolean;
}

export function FeaturedProductsSection({
  products: propProducts,
  isLoading: propIsLoading,
}: FeaturedProductsSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch products from your server hook
  const {
    products: fetchedProducts,
    isLoading: hookIsLoading,
    error,
    refetchProducts,
  } = useProducts();

  const products = propProducts ?? fetchedProducts;
  const isLoading = propIsLoading ?? hookIsLoading;

  // Initialize Embla Carousel with infinite loop and auto-scroll (without slicing)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [
      AutoScroll({
        speed: 1, // Smooth ambient scrolling speed
        stopOnInteraction: false, // Resume auto-scroll after user interaction
        stopOnMouseEnter: true, // Pause auto-scroll when hovering over products
      }),
    ]
  );

  // Handle Wheel scroll with non-passive listener to prevent vertical page hijacking
  useEffect(() => {
    const element = containerRef.current;
    if (!element || !emblaApi) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();

      if (e.deltaY > 0) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollPrev();
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [emblaApi]);

  if (error) {
    return (
      <section className="w-full bg-brav-white py-16 lg:py-24 border-b border-brav-border">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <p className="text-xs text-red-600 font-sans">Unable to load featured products.</p>
          <button
            onClick={() => refetchProducts()}
            className="px-4 py-2 bg-brav-charcoal text-brav-white text-xs font-semibold rounded-xl"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-brav-white py-16 lg:py-24 border-b border-brav-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & View All Products Action Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-brav-border gap-6">
          <div className="space-y-1">
            <span className="text-xs font-sans font-semibold tracking-wider text-brav-gold uppercase">
              Handpicked Essentials
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-brav-charcoal tracking-tight">
              Discover Craft & Innovation
            </h2>
          </div>

          {/* View All Products Button */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brav-charcoal hover:bg-brav-dark text-brav-white font-sans font-semibold text-xs rounded-xl shadow-sm transition-all duration-300 self-start md:self-auto group"
          >
            <span>View All Products</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </Link>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 w-80 sm:w-96 shrink-0 rounded-2xl bg-brav-surface border border-brav-border animate-pulse"
              />
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-16 text-xs text-brav-muted font-sans">
            No products available in this collection.
          </div>
        ) : (
          /* Embla Carousel Viewport */
          <div 
            ref={(node) => {
              emblaRef(node);
              containerRef.current = node;
            }}
            className="overflow-hidden cursor-grab active:cursor-grabbing"
          >
            <div className="flex gap-6">
              {products.map((product, idx) => (
                <div 
                  key={product.id}
                  className="flex-[0_0_80%] sm:flex-[0_0_45%] lg:flex-[0_0_23%] min-w-0"
                >
                  <ProductCard
                    product={product}
                    discountPrice={idx === 0 ? '249.00' : undefined}
                    onAddToCart={(p) => console.log('Added to cart:', p.name)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}