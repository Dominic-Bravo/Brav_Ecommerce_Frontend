// app/products/page.tsx
"use client";

import React, { Suspense } from "react";
import { ProductCatalog } from "@/features/components/products/ProductCatalog";
import type { Product } from "@/api/generated/models/product";

export default function ProductsPage() {
  // Optional: Quick Add to Cart integration handler
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Adding product to cart:", product.name);
    // Call your cart mutation hook here (e.g., useAddToCart())
  };

  return (
    <main className="min-h-screen bg-brav-surface py-8 font-sans selection:bg-brav-gold/20">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="inline-block w-8 h-8 border-4 border-brav-gold border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-sm text-brav-muted font-sans">Loading catalog...</p>
          </div>
        }
      >
        <ProductCatalog onAddToCart={handleAddToCart} />
      </Suspense>
    </main>
  );
}
