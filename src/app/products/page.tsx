// app/products/page.tsx
"use client";

import React from "react";
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
      <ProductCatalog onAddToCart={handleAddToCart} />
    </main>
  );
}