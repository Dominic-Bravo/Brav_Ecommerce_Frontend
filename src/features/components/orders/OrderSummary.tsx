'use client';

import React, { useMemo } from 'react';
import { useCartList } from '@/hooks/cart/useCart';
import { CouponInput } from '@/features/components/orders/CouponInput';
import { CheckoutButton } from '@/features/components/orders/CheckoutButton';
import { useRouter } from 'next/navigation';

interface OrderSummaryProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export function OrderSummary({
  couponCode,
  setCouponCode,
  paymentMethod,
  setPaymentMethod,
}: OrderSummaryProps) {
  const router = useRouter();
  const { carts, isLoading } = useCartList();

  // 1. Calculate Subtotal from cart items
  const subtotal = useMemo(() => {
    if (!carts || carts.length === 0) return 0;
    return carts.reduce((acc, item) => {
      const itemSubtotal =
        typeof item.subtotal === 'string'
          ? parseFloat(item.subtotal)
          : item.subtotal || 0;
      return acc + itemSubtotal;
    }, 0);
  }, [carts]);

  // 2. Calculate Shipping ($15 flat rate, free for orders over $150)
  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal > 150 ? 0 : 15.0;
  }, [subtotal]);

  // 3. Discount calculation (e.g., 10% off when coupon code is present)
  const discount = useMemo(() => {
    if (!couponCode.trim()) return 0;
    return subtotal * 0.1;
  }, [subtotal, couponCode]);

  // 4. Total = Subtotal + Shipping - Discount
  const total = useMemo(() => {
    return Math.max(0, subtotal + shipping - discount);
  }, [subtotal, shipping, discount]);

  return (
    <div className="bg-brav-white p-6 sm:p-8 rounded-2xl border border-brav-border shadow-sm space-y-6 font-sans">
      <h2 className="font-display text-2xl font-medium text-brav-charcoal tracking-tight border-b border-brav-border pb-4">
        Order Summary
      </h2>

      {/* Payment Selector */}
      <div className="space-y-1.5">
        <label
          htmlFor="paymentMethod"
          className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80"
        >
          Payment Method
        </label>
        <div className="relative">
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full appearance-none rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200 pr-10"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
          <svg
            className="w-4 h-4 text-brav-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* Coupon Code Input */}
      <div className="pt-2 border-t border-brav-border">
        <CouponInput value={couponCode} onChange={setCouponCode} />
      </div>

      {/* Financial Calculations Table */}
      <div className="space-y-3 pt-4 border-t border-brav-border text-sm font-sans">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-brav-charcoal">
          <span className="text-brav-muted font-normal">Subtotal</span>
          <span className="font-semibold text-brav-charcoal">
            {isLoading ? (
              <span className="h-4 w-12 bg-brav-surface animate-pulse rounded inline-block" />
            ) : (
              `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            )}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center text-brav-charcoal">
          <span className="text-brav-muted font-normal">Shipping</span>
          <span className="font-semibold text-brav-charcoal">
            {isLoading ? (
              <span className="h-4 w-12 bg-brav-surface animate-pulse rounded inline-block" />
            ) : shipping === 0 ? (
              <span className="text-success font-semibold text-xs uppercase tracking-wider bg-success/10 px-2 py-0.5 rounded border border-success/20">
                Free
              </span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between items-center text-success">
            <span className="font-normal">Discount</span>
            <span className="font-semibold">
              -${discount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-3 border-t border-brav-border">
          <span className="font-display text-lg font-medium text-brav-charcoal">Total</span>
          <span className="font-display text-2xl font-semibold text-brav-charcoal">
            {isLoading ? (
              <span className="h-6 w-20 bg-brav-surface animate-pulse rounded inline-block" />
            ) : (
              `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            )}
          </span>
        </div>
      </div>

      {/* Checkout Action Button */}
      <div className="pt-4 border-t border-brav-border">
        <CheckoutButton
          paymentMethod={paymentMethod}
          couponCode={couponCode || undefined}
          onSuccess={() => {
            router.push('/checkout/order-success');
          }}
        />
      </div>
    </div>
  );
}