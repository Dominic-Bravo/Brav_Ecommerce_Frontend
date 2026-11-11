'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '@/api/generated/models/product';
import { useProducts } from '@/hooks/products/useProducts';
import { useCategoryList } from '@/hooks/categories/useCategories';

interface ProductCatalogProps {
  onAddToCart?: (product: Product, e: React.MouseEvent) => void;
}

export function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategory = searchParams.get('category');

  // Derive the active category directly from URL params with a fallback to 'all'
  const selectedCategory = urlCategory || 'all';

  // 1. Local filter & pagination states
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // 2. Correct hook consumption
  const {
    products,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    isLoading, 
    isFetching,
    error,
    setPage,
    setSearchQuery,
    refetchProducts,
  } = useProducts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  const {
    categories,
    isLoading: isLoadingCategories,
  } = useCategoryList();

  // Handle Category Selection Change by updating the URL query parameters
  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug === 'all') {
      params.delete('category');
    } else {
      params.set('category', categorySlug);
    }
    router.push(`?${params.toString()}`, { scroll: false });
    setPageNumber(1);
    setPage(1);
  };

  // Synchronize local search with hook query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    setSearchQuery(val);
    setPageNumber(1);
    setPage(1);
  };

  // 3. Client-side Sort & Availability pipeline
  const processedProducts = useMemo(() => {
    if (!products) return [];

    return [...products]
      .filter((p) => {
        if (inStockOnly) {
          const stock = p.stock_quantity ?? 0;
          return p.status === 'active' && stock > 0;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseFloat(a.price) : (a.price || 0);
        const priceB = typeof b.price === 'string' ? parseFloat(b.price) : (b.price || 0);

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, inStockOnly, sortBy]);

  // Handle Page Changes
  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    setPage(newPage);
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4 font-sans">
        <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6 text-xs text-red-700 max-w-md mx-auto space-y-3">
          <p role="alert" className="font-semibold text-sm">
            Failed to load product catalog. Please try again.
          </p>
          <button
            onClick={() => refetchProducts()}
            className="px-5 py-2.5 bg-brav-charcoal hover:bg-brav-dark text-brav-white font-semibold text-xs rounded-xl shadow-md transition-all duration-200"
          >
            Retry Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans selection:bg-brav-gold/20 space-y-8">
      
      {/* Search & Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brav-border pb-6">
        <div className="space-y-1">
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-brav-gold">
            Curated Collection
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-brav-charcoal">
            Product Catalog
          </h1>
        </div>

        {/* Global Search Input */}
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full px-4 py-2.5 pl-10 text-xs sm:text-sm bg-brav-surface border border-brav-border rounded-xl placeholder:text-brav-muted text-brav-charcoal focus:outline-none focus:border-brav-gold focus:bg-brav-white focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
          />
          <Search className="w-4 h-4 text-brav-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Catalog Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-brav-surface border border-brav-border rounded-xl text-xs font-semibold text-brav-charcoal active:scale-95 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-brav-gold" />
            <span>Filters</span>
          </button>

          <p className="text-xs sm:text-sm text-brav-muted font-sans">
            Total Products: <span className="font-semibold text-brav-charcoal">{totalCount}</span>
            {isFetching && <span className="ml-2 text-brav-gold animate-pulse text-xs">(Syncing...)</span>}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <label htmlFor="sortBy" className="text-xs font-semibold uppercase tracking-wider text-brav-muted hidden sm:block">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc" | "name")}
              className="appearance-none rounded-xl border border-brav-border bg-brav-surface px-4 py-2 pr-9 text-xs sm:text-sm text-brav-charcoal font-semibold focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-brav-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Left Sidebar (3 Cols) */}
        <aside className="hidden lg:block lg:col-span-3 bg-brav-white p-6 rounded-2xl border border-brav-border shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-brav-border pb-4">
            <h3 className="font-display text-lg font-medium text-brav-charcoal tracking-tight flex items-center gap-2">
              <Filter className="w-4 h-4 text-brav-gold" />
              Refine Results
            </h3>
            {(selectedCategory !== 'all' || inStockOnly) && (
              <button
                type="button"
                onClick={() => {
                  handleCategoryChange('all');
                  setInStockOnly(false);
                }}
                className="text-[11px] font-semibold text-brav-gold hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories List Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80 block">
              Categories
            </label>
            <div className="flex flex-col space-y-1">
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-brav-charcoal text-brav-white font-semibold'
                    : 'text-brav-muted hover:bg-brav-surface hover:text-brav-charcoal'
                }`}
              >
                All Categories
              </button>
              {isLoadingCategories ? (
                <p className="text-xs text-brav-muted px-3 py-1">Loading categories...</p>
              ) : (
                categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedCategory === category.slug
                        ? 'bg-brav-charcoal text-brav-white font-semibold'
                        : 'text-brav-muted hover:bg-brav-surface hover:text-brav-charcoal'
                    }`}
                  >
                    {category.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="space-y-2 pt-4 border-t border-brav-border">
            <label className="text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80 block">
              Availability
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-brav-gold border-brav-border rounded cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-brav-muted group-hover:text-brav-charcoal transition-colors">
                In Stock Only
              </span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area (9 Cols) */}
        <main className="lg:col-span-9 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="aspect-3/4 bg-brav-surface rounded-xl animate-pulse border border-brav-border" />
              ))}
            </div>
          ) : processedProducts.length === 0 ? (
            <div className="text-center py-20 bg-brav-surface rounded-2xl border border-dashed border-brav-border p-6 space-y-2">
              <p className="text-brav-charcoal font-medium text-sm sm:text-base">No products found.</p>
              <p className="text-xs text-brav-muted">Try clearing search inputs or filter toggles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {processedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 4}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalCount > 0 && (
            <div className="flex items-center justify-between pt-6 border-t border-brav-border font-sans">
              <p className="text-xs sm:text-sm text-brav-muted font-medium">
                Page <span className="font-semibold text-brav-charcoal">{pageNumber}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(pageNumber - 1, 1))}
                  disabled={!hasPreviousPage || isFetching}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-brav-charcoal bg-brav-surface border border-brav-border rounded-xl hover:bg-brav-white hover:border-brav-gold/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => handlePageChange(pageNumber + 1)}
                  disabled={!hasNextPage || isFetching}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-brav-charcoal bg-brav-surface border border-brav-border rounded-xl hover:bg-brav-white hover:border-brav-gold/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer Filter */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex font-sans">
          <div
            className="fixed inset-0 bg-brav-charcoal/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-xs bg-brav-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-brav-border pb-4">
                <h3 className="font-display text-lg font-medium text-brav-charcoal tracking-tight flex items-center gap-2">
                  <Filter className="w-4 h-4 text-brav-gold" />
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-brav-muted hover:text-brav-charcoal rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80 block">
                  Categories
                </label>
                <div className="flex flex-col space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleCategoryChange('all');
                      setIsMobileFilterOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium ${
                      selectedCategory === 'all'
                        ? 'bg-brav-charcoal text-brav-white font-semibold'
                        : 'text-brav-muted hover:bg-brav-surface'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        handleCategoryChange(category.slug);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-medium ${
                        selectedCategory === category.slug
                          ? 'bg-brav-charcoal text-brav-white font-semibold'
                          : 'text-brav-muted hover:bg-brav-surface'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Availability Filter */}
              <div className="space-y-2 pt-4 border-t border-brav-border">
                <label className="text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80 block">
                  Availability
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-brav-gold border-brav-border rounded"
                  />
                  <span className="text-xs sm:text-sm text-brav-muted">In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-brav-border mt-6">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-brav-charcoal text-brav-white font-semibold text-sm rounded-xl shadow-md active:scale-95 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}