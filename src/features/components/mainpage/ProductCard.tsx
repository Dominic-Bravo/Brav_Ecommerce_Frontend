import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/api/generated/models/product';

export interface ProductCardProps {
  product: Product;
  discountPrice?: string;
  rating?: number;
  reviewCount?: number;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({
  product,
  discountPrice,
  rating = 4.8,
  reviewCount = 24,
  onAddToCart,
}: ProductCardProps) {
  // Determine primary display image with fallback
  const primaryImage =
    product.image_url ||
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop';

  const formatPrice = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  };

  return (
    <div className="group relative bg-brav-white rounded-2xl border border-brav-border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-brav-gold/40">
      
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-brav-surface overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPrice && (
            <span className="px-2.5 py-1 text-[10px] font-sans font-semibold tracking-wider text-brav-white bg-brav-dark uppercase rounded">
              Sale
            </span>
          )}
          {product.category_name && (
            <span className="px-2.5 py-1 text-[10px] font-sans font-semibold tracking-wider text-brav-gold bg-brav-white/90 backdrop-blur-sm border border-brav-border uppercase rounded">
              {product.category_name}
            </span>
          )}
        </div>

        {/* Quick View Link */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 z-0"
          aria-label={`View ${product.name}`}
        />
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1">
              <div className="flex text-brav-gold">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(rating) ? 'fill-current' : 'text-brav-border fill-current'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[11px] font-sans text-brav-muted font-normal">
                {rating} ({reviewCount})
              </span>
            </div>
          )}

          {/* Title: DM Sans 500-600 */}
          <h3 className="font-sans font-medium text-base text-brav-charcoal group-hover:text-brav-gold transition-colors line-clamp-1">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-brav-border/60 flex items-center justify-between gap-2">
          {/* Prices: DM Sans 600 */}
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-semibold text-lg text-brav-charcoal">
              {discountPrice ? formatPrice(discountPrice) : formatPrice(product.price)}
            </span>
            {discountPrice && (
              <span className="font-sans font-normal text-xs text-brav-muted line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart / View Button: DM Sans 600 */}
          <button
            onClick={() => onAddToCart?.(product)}
            className="px-3.5 py-2 text-xs font-sans font-semibold text-brav-charcoal bg-brav-surface hover:bg-brav-charcoal hover:text-brav-white border border-brav-border rounded-lg transition-colors flex items-center gap-1.5"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>

    </div>
  );
}