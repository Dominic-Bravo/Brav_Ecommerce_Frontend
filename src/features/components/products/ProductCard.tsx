'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/api/generated/models/product';
import { AddToCartButton } from '../carts/AddToCartButton';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  onAddToCart?: (product: Product, e: React.MouseEvent) => void;
  onImageClick?: (product: Product, e: React.MouseEvent) => void;
}

export function ProductCard({ product, priority = false, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.image_url ||
    '/placeholders/product-placeholder.png';

  const secondaryImage =
    product.images?.find((img) => !img.is_primary)?.image_url || null;

  const activeImage = isHovered && secondaryImage
    ? secondaryImage
    : primaryImage;

  const numericPrice =
    typeof product.price === 'string'
      ? parseFloat(product.price)
      : product.price || 0;

  const stockCount = product.stock_quantity ?? 0;
  const isAvailable = product.status === 'active' && stockCount > 0;

  // Handler to prevent Link navigation when clicking add-to-cart
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the <Link> navigation
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, e);
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col h-full bg-brav-white rounded-xl border border-brav-border overflow-hidden transition-all duration-300 hover:shadow-md hover:border-brav-gold/40 font-sans selection:bg-brav-gold/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-brav-surface">
        <Image
          src={activeImage}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />

        {/* Stock Badge */}
        {!isAvailable ? (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-brav-charcoal/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brav-white">
            Out of Stock
          </span>
        ) : stockCount <= 5 ? (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-brav-gold/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brav-white">
            Low Stock
          </span>
        ) : null}

        {/* Desktop Quick Add (Hover overlay) */}
        <div 
          className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          onClick={handleAddToCartClick}
        >
          <AddToCartButton
            productId={product.id}
            disabled={!isAvailable}
            className="w-full flex items-center justify-center gap-2 bg-brav-charcoal/95 hover:bg-brav-dark text-brav-white text-xs font-semibold py-2 px-3 rounded-lg shadow-md transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add To Cart</span>
          </AddToCartButton>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between space-y-2">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brav-gold block">
            {product.category_name || 'Curated'}
          </span>

          <h3 className="font-medium text-sm sm:text-base text-brav-charcoal line-clamp-2 leading-snug group-hover:text-brav-gold transition-colors duration-200">
            {product.name}
          </h3>
        </div>

        {/* Price & Mobile Quick Add */}
        <div className="pt-2 border-t border-brav-border/60 flex items-center justify-between gap-2">
          <span className="text-sm sm:text-base font-semibold text-brav-charcoal shrink-0">
            ${numericPrice.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>

          {/* Mobile Quick Add Button */}
          <div className="sm:hidden shrink-0" onClick={handleAddToCartClick}>
            <AddToCartButton
              productId={product.id}
              disabled={!isAvailable}
              className="h-8 px-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-brav-surface border border-brav-border text-brav-charcoal active:bg-brav-charcoal active:text-brav-white transition-colors text-xs font-semibold"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span>Add</span>
            </AddToCartButton>
          </div>
        </div>
      </div>
    </Link>
  );
}