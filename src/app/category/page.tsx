'use client';

import React, { useState, useMemo } from 'react';
import { useProducts } from '@/hooks/products/useProducts';
import { useCategoryList } from '@/hooks/categories/useCategories';
import { ProductCard } from '@/features/components/products/ProductCard';

export default function ProductCatalogWithCategories() {
  // 1. Fetch products & categories using isolated custom hooks
  const { products, isLoading: isLoadingProducts, error: productError } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategoryList();

  // 2. Local state for selected category filter ("all" by default)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 3. Filter products by chosen category
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCategory === 'all') return products;

    return products.filter((product) => {
      // Matches against category_slug or category_name depending on model structure
      return (
        product.category_name === selectedCategory ||
        product.category_name?.toLowerCase() === selectedCategory.toLowerCase()
      );
    });
  }, [products, selectedCategory]);

  if (isLoadingProducts || isLoadingCategories) {
    return <div className="py-12 text-center text-brav-muted text-sm">Loading catalog...</div>;
  }

  if (productError) {
    return <div className="py-12 text-center text-red-600 text-sm">Failed to load products.</div>;
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Category Selection Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-brav-charcoal text-brav-white shadow-xs'
              : 'bg-brav-surface border border-brav-border text-brav-charcoal hover:border-brav-gold/40'
          }`}
        >
          All Categories
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === category.slug
                ? 'bg-brav-charcoal text-brav-white shadow-xs'
                : 'bg-brav-surface border border-brav-border text-brav-charcoal hover:border-brav-gold/40'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-brav-surface border border-dashed border-brav-border rounded-2xl">
          <p className="text-sm text-brav-muted">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}