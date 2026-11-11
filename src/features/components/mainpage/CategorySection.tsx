'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { useCategoryList } from '@/hooks/categories/useCategories';
import type { Category } from '@/api/generated/models/categories/category';

interface CategorySectionProps {
  categories?: Category[];
  isLoading?: boolean;
  error?: unknown;
}

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  clothes: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop',
  apparel: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop',
  technology: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
  tech: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
};

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop';

export function CategorySection(props: CategorySectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hookData = useCategoryList();

  const categories = props.categories ?? hookData.categories;
  const isLoading = props.isLoading ?? hookData.isLoading;
  const error = props.error ?? hookData.error;

  const activeCategories = categories.filter((c) => c.is_active !== false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [
      AutoScroll({
        speed: 1,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  // Handle Wheel scroll with non-passive listener to prevent page vertical scroll
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

  return (
    <section className="w-full bg-brav-surface py-16 lg:py-24 border-b border-brav-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading & View All Products Action Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-brav-border gap-6">
          <div className="space-y-1">
            <span className="text-xs font-sans font-semibold tracking-wider text-brav-gold uppercase">
              Curated Collections
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-brav-charcoal tracking-tight">
              Shop by Category
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

        {/* Error State */}
        {error && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center text-red-600 font-sans text-sm">
            Unable to load categories at the moment. Please try again later.
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 w-80 sm:w-96 shrink-0 rounded-2xl bg-brav-border/40 animate-pulse border border-brav-border"
              />
            ))}
          </div>
        ) : (
          /* Embla Carousel Viewport with Native Non-Passive Wheel Event */
          <div 
            ref={(node) => {
              emblaRef(node);
              containerRef.current = node;
            }}
            className="overflow-hidden cursor-grab active:cursor-grabbing"
          >
            <div className="flex gap-6">
              {activeCategories.map((category) => {
                const bgImg =
                  category.image ||
                  DEFAULT_CATEGORY_IMAGES[category.slug.toLowerCase()] ||
                  PLACEHOLDER_IMAGE;

                return (
                  <div 
                    key={category.id} 
                    className="flex-[0_0_80%] sm:flex-[0_0_45%] lg:flex-[0_0_31%] min-w-0"
                  >
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="group relative h-96 w-full rounded-2xl overflow-hidden border border-brav-border shadow-sm flex flex-col justify-end p-6 transition-all duration-500 hover:shadow-xl hover:border-brav-gold/50 block select-none"
                    >
                      <Image
                        src={bgImg}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 31vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        draggable={false}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-brav-dark/85 via-brav-dark/40 to-transparent transition-opacity duration-300 group-hover:from-brav-dark/90" />

                      <div className="relative z-10 space-y-2">
                        <h3 className="font-sans font-semibold text-2xl text-brav-white tracking-tight group-hover:text-brav-gold transition-colors">
                          {category.name}
                        </h3>

                        {category.description && (
                          <p className="font-sans font-normal text-xs text-brav-white/80 line-clamp-2 leading-relaxed">
                            {category.description}
                          </p>
                        )}

                        <div className="pt-2 flex items-center gap-1.5 text-xs font-sans font-semibold text-brav-gold">
                          <span>Explore Collection</span>
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
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}