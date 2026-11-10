'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthSession } from '@/features/auth/providers/auth-provider';
import { CartList } from '../carts/CartList';
import { DefaultAddressCard } from '@/features/components/orders/DefaultAddressCard';
import { OrderSummary } from '@/features/components/orders/OrderSummary';

export default function CheckoutPage() {
  const { isAuthenticated, isInitialized } = useAuthSession();
  const [couponCode, setCouponCode] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');

  if (!isInitialized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-sans">
        <div className="flex items-center gap-3 bg-brav-surface px-6 py-4 rounded-xl border border-brav-border shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brav-gold border-t-transparent" />
          <p className="text-sm font-medium text-brav-charcoal">Checking session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4 font-sans selection:bg-brav-gold/20">
        <div className="max-w-md bg-brav-white p-8 rounded-2xl border border-brav-border shadow-xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brav-gold">
            Authentication Required
          </span>
          <h1 className="font-display text-3xl font-medium text-brav-charcoal tracking-tight">
            Access Restricted
          </h1>
          <p className="text-xs sm:text-sm text-brav-muted leading-relaxed">
            You need to be logged in to view your bag and complete your order. Please sign in to continue.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-brav-charcoal hover:bg-brav-dark text-brav-white font-semibold text-xs rounded-xl shadow-md transition-all"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-brav-surface hover:bg-brav-white text-brav-charcoal font-semibold text-xs rounded-xl border border-brav-border transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 font-sans selection:bg-brav-gold/20">
      {/* Page Header */}
      <div className="mb-8 space-y-1">
        <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-brav-gold">
          Express Checkout
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-brav-charcoal">
          Review & Place Order
        </h1>
        <p className="font-sans text-xs sm:text-sm text-brav-muted">
          Review your cart items, select shipping details, and complete your transaction.
        </p>
      </div>

      {/* Two-Column Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Cart Items & Address Card) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          <section className="bg-brav-white rounded-2xl border border-brav-border shadow-sm overflow-hidden">
            <CartList />
          </section>

          <section className="bg-brav-white p-6 sm:p-8 rounded-2xl border border-brav-border shadow-sm space-y-4">
            <h2 className="font-display text-xl font-medium text-brav-charcoal tracking-tight">
              Shipping Destination
            </h2>
            <DefaultAddressCard />
          </section>
        </div>

        {/* Right Column (Calculated Summary & Checkout) */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8">
          <OrderSummary
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
      </div>
    </main>
  );
}