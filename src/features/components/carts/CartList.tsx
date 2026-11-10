
'use client';

import React, { useState } from 'react';
import { useCartList, useUpdateCart, useDeleteCart } from '@/hooks/cart/useCart';
import Image from 'next/image';

export function CartList() {
  const {
    carts,
    totalCount,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useCartList();

  const { updateCartAsync } = useUpdateCart();
  const { deleteCartAsync } = useDeleteCart();

  const [updatingItems, setUpdatingItems] = useState<string[]>([]);
  const [deletingItems, setDeletingItems] = useState<string[]>([]);

  const handleQuantityChange = async (id: string, quantity: number) => {
    if (quantity < 1 || updatingItems.includes(id)) return;

    setUpdatingItems((prev) => [...prev, id]);

    try {
      await updateCartAsync({
        params: { id },
        data: { quantity },
      });
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
    } finally {
      setUpdatingItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingItems.includes(id)) return;

    const confirmed = window.confirm(
      'Are you sure you want to remove this item from your cart?'
    );

    if (!confirmed) return;

    setDeletingItems((prev) => [...prev, id]);

    try {
      await deleteCartAsync({ id });
    } catch (error) {
      console.error('Failed to delete cart item:', error);
    } finally {
      setDeletingItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] font-sans">
        <div className="flex items-center gap-3 bg-brav-surface px-6 py-4 rounded-xl border border-brav-border shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brav-gold border-t-transparent" />
          <p className="text-sm font-medium text-brav-charcoal">
            Loading cart items...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4 font-sans">
        <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6 text-xs text-red-700 max-w-md mx-auto space-y-3">
          <p role="alert" className="font-semibold text-sm">
            Failed to load cart items. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-brav-charcoal hover:bg-brav-dark text-brav-white font-semibold text-xs rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 font-sans selection:bg-brav-gold/20">

      {/* Header */}
      <div className="flex justify-between items-center border-b border-brav-border pb-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brav-gold">
            Order Overview
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-brav-charcoal">
            Cart Items ({totalCount})
          </h1>
        </div>

        {isFetching && (
          <span className="text-xs font-semibold text-brav-gold animate-pulse uppercase tracking-wider bg-brav-gold/10 px-3 py-1 rounded-full border border-brav-gold/20">
            Syncing...
          </span>
        )}
      </div>

      {/* Cart Items */}
      {carts.length === 0 ? (
        <div className="text-center py-16 bg-brav-surface rounded-2xl border border-dashed border-brav-border p-6 space-y-2">
          <p className="text-brav-charcoal font-medium text-sm">
            Your cart is empty.
          </p>
          <p className="text-xs text-brav-muted">
            Explore our collection and add something to your bag.
          </p>
        </div>
      ) : (
        <div className="border border-brav-border rounded-2xl divide-y divide-brav-border bg-brav-white shadow-sm overflow-hidden">
          {carts.map((item) => {
            const product = item.product_details;
            const quantity = item.quantity ?? 1;

            const primaryImage =
              product?.images?.find((img) => img.is_primary)?.image_url ||
              product?.image_url;

            const isUpdating = updatingItems.includes(item.id);
            const isDeleting = deletingItems.includes(item.id);

            return (
              <div
                key={item.id}
                className={`p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-brav-surface/60 transition-colors ${
                  isDeleting ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {/* Product Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-brav-surface rounded-xl overflow-hidden shrink-0 border border-brav-border flex items-center justify-center relative">
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={product?.name || 'Product image'}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-[10px] text-brav-muted uppercase tracking-wider font-semibold">
                        No image
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-brav-charcoal text-base">
                      {product?.name ?? 'Unnamed Product'}
                    </h3>

                    {product?.category_name && (
                      <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-brav-gold/15 text-brav-gold rounded-full border border-brav-gold/30">
                        {product.category_name}
                      </span>
                    )}

                    <p className="text-xs text-brav-muted">
                      SKU:{' '}
                      <span className="font-medium text-brav-charcoal/80">
                        {product?.sku ?? 'N/A'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Quantity and Pricing */}
                <div className="flex flex-col items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-brav-border">

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={quantity <= 1 || isUpdating || isDeleting}
                      onClick={() => handleQuantityChange(item.id, quantity - 1)}
                      aria-label={`Decrease quantity of ${product?.name}`}
                      className="w-8 h-8 rounded-lg border border-brav-border flex items-center justify-center text-brav-charcoal hover:border-brav-gold disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      −
                    </button>

                    <span className="min-w-6 text-center text-sm font-semibold text-brav-charcoal">
                      {isUpdating ? '...' : quantity}
                    </span>

                    <button
                      type="button"
                      disabled={isUpdating || isDeleting}
                      onClick={() => handleQuantityChange(item.id, quantity + 1)}
                      aria-label={`Increase quantity of ${product?.name}`}
                      className="w-8 h-8 rounded-lg border border-brav-border flex items-center justify-center text-brav-charcoal hover:border-brav-gold disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <div className="text-base font-semibold text-brav-charcoal">
                      Subtotal: ${item.subtotal}
                    </div>

                    <div className="text-xs text-brav-muted font-medium">
                      {quantity} × ${item.unit_price}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    disabled={isUpdating || isDeleting}
                    onClick={() => handleDelete(item.id)}
                    className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-40 transition"
                  >
                    {isDeleting ? 'Removing...' : 'Remove item'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
