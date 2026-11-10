// app/products/[slug]/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useV1ProductsProductsRetrieve } from '@/api/generated/endpoints/products/products';
import { ShoppingBag, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { AddToCartButton } from '@/features/components/carts/AddToCartButton';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Retrieve single product details by slug using Orval hook
  const { data: product, isLoading, error } = useV1ProductsProductsRetrieve(slug, {
    query: {
      enabled: Boolean(slug),
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 bg-brav-surface px-6 py-4 rounded-xl border border-brav-border shadow-xs">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brav-gold border-t-transparent" />
          <p className="text-sm font-medium text-brav-charcoal">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center font-sans space-y-4">
        <div className="bg-brav-white p-8 rounded-2xl border border-brav-border shadow-sm space-y-3">
          <h1 className="font-display text-2xl font-medium text-brav-charcoal">Product Not Found</h1>
          <p className="text-xs sm:text-sm text-brav-muted">
            The item you are looking for does not exist or has been removed.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brav-charcoal text-brav-white font-semibold text-xs rounded-xl shadow-md transition-all hover:bg-brav-dark"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.image_url ||
    '/placeholders/product-placeholder.png';

  const numericPrice = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
  const isAvailable = product.status === 'active' && (product.stock_quantity ?? 0) > 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 font-sans selection:bg-brav-gold/20">
      
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brav-muted hover:text-brav-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full bg-brav-white rounded-2xl border border-brav-border overflow-hidden shadow-sm">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              priority
              className="object-cover object-center"
              unoptimized
            />
          </div>

          {/* Additional Images Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="relative w-20 h-20 bg-brav-surface rounded-xl border border-brav-border overflow-hidden shrink-0"
                >
                  <Image
                    src={img.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Meta & Purchase Panel */}
        <div className="lg:col-span-5 space-y-6 bg-brav-white p-6 sm:p-8 rounded-2xl border border-brav-border shadow-sm">
          <div className="space-y-2 border-b border-brav-border pb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brav-gold block">
              {product.category_name || 'Curated'}
            </span>
            <h1 className="font-display text-3xl font-medium tracking-tight text-brav-charcoal">
              {product.name}
            </h1>
            <p className="text-xs text-brav-muted">SKU: {product.sku}</p>
          </div>

          {/* Pricing & Stock Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-3xl font-semibold text-brav-charcoal">
                ${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>

              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {isAvailable ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-success">In Stock ({product.stock_quantity})</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-500">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-brav-muted leading-relaxed pt-2 border-t border-brav-border/60">
              {product.description || 'No product description available.'}
            </p>
          </div>

          {/* Add to Cart Action */}
          <div className="pt-6 border-t border-brav-border space-y-3">
            <AddToCartButton
              productId={product.id}
              disabled={!isAvailable}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-brav-charcoal hover:bg-brav-dark text-brav-white font-semibold text-sm rounded-xl shadow-md shadow-brav-charcoal/10 focus:outline-none focus:ring-4 focus:ring-brav-gold/20 active:scale-[0.99]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </AddToCartButton>
          </div>

        </div>

      </div>
    </main>
  );
}