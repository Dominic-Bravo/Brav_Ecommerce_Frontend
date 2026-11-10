
'use client';

import type { ReactNode, MouseEvent } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCreateCart } from '@/hooks/cart/useCart';

interface AddToCartButtonProps {
  productId: string | number;
  quantity?: number;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  onSuccess?: () => void;
}

export function AddToCartButton({
  productId,
  quantity = 1,
  className = '',
  disabled = false,
  children,
  onSuccess,
}: AddToCartButtonProps) {
  const { createCart, isCreating } = useCreateCart();

  const handleAddToCart = async (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await createCart({
        product_id: String(productId),
        quantity,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={disabled || isCreating}
      className={`bg-brav-gold text-white py-2 rounded text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isCreating ? (
        <>
          <span className="animate-pulse">Adding...</span>
        </>
      ) : (
        children ?? (
          <>
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </>
        )
      )}
    </button>
  );
}
