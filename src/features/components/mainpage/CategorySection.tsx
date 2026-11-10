import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/api/generated/models/categories/category'; // Adjust path to your generated Orval types

interface CategorySectionProps {
  categories?: Category[];
  isLoading?: boolean;
}

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  clothes: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop',
  apparel: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop',
  technology: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
  tech: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
};

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-01',
    name: 'Clothes',
    slug: 'clothes',
    description: 'Timeless apparel and elevated essentials engineered for daily wear.',
    parent: null,
    children: '[]',
    image: null,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-02',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Handcrafted leather goods, jewelry, and luxury everyday carries.',
    parent: null,
    children: '[]',
    image: null,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-03',
    name: 'Technology',
    slug: 'technology',
    description: 'Minimalist devices, audio gear, and high-performance accessories.',
    parent: null,
    children: '[]',
    image: null,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export function CategorySection({
  categories = MOCK_CATEGORIES,
  isLoading = false,
}: CategorySectionProps) {
  const activeCategories = categories.filter((c) => c.is_active !== false && !c.parent);

  return (
    <section className="w-full bg-brav-surface py-16 lg:py-24 border-b border-brav-border">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-brav-border gap-4">
          <div className="space-y-1">
            <span className="text-xs font-sans font-semibold tracking-wider text-brav-gold uppercase">
              Curated Collections
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-brav-charcoal tracking-tight">
              Shop by Category
            </h2>
          </div>
          <p className="text-sm font-sans text-brav-muted max-w-sm">
            Navigate directly to our carefully crafted apparel, hardware, and accessories.
          </p>
        </div>

        {/* Loading Skeleton Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-brav-border/40 animate-pulse border border-brav-border"
              />
            ))}
          </div>
        ) : (
          /* Category Card Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeCategories.map((category) => {
              const bgImg =
                category.image ||
                DEFAULT_CATEGORY_IMAGES[category.slug.toLowerCase()] ||
                PLACEHOLDER_IMAGE;

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative h-96 w-full rounded-2xl overflow-hidden border border-brav-border shadow-sm flex flex-col justify-end p-6 transition-all duration-500 hover:shadow-xl hover:border-brav-gold/50"
                >
                  {/* Next.js Image with fill layout */}
                  <Image
                    src={bgImg}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brav-dark/85 via-brav-dark/40 to-transparent transition-opacity duration-300 group-hover:from-brav-dark/90" />

                  {/* Content Container */}
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
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}