"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DefaultAddressCard } from "@/features/components/orders/DefaultAddressCard";
import { CouponInput } from "@/features/components/orders/CouponInput";
import { CheckoutButton } from "@/features/components/orders/CheckoutButton";

export default function CheckOutCard() {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Credit Card");

  return (
  <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14 font-sans selection:bg-brav-gold/20">
    
    {/* Page Header */}
    <div className="mb-8 space-y-1">
      <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-brav-gold">
        Secure Transaction
      </span>
      <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-brav-charcoal">
        Checkout
      </h1>
      <p className="font-sans text-xs sm:text-sm text-brav-muted">
        Review your shipping details and select a payment method to complete your order.
      </p>
    </div>

    {/* Main Checkout Container */}
    <div className="bg-brav-white p-6 sm:p-8 rounded-2xl border border-brav-border shadow-sm space-y-6">

      {/* 1. Address Section */}
      <div className="pb-6 border-b border-brav-border">
        <DefaultAddressCard />
      </div>

      {/* 2. Payment Selector */}
      <div className="space-y-1.5">
        <label htmlFor="paymentMethod" className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
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

      {/* 3. Coupon Input */}
      <div className="pt-2">
        <CouponInput value={couponCode} onChange={setCouponCode} />
      </div>

      {/* 4. Action Button */}
      <div className="pt-6 border-t border-brav-border">
        <CheckoutButton
          paymentMethod={paymentMethod}
          couponCode={couponCode || undefined}
          onSuccess={() => {
            router.push("/checkout/order-success");
          }}
        />
      </div>

    </div>
  </main>
);
}