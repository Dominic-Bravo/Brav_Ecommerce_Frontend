"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DefaultAddressCard } from "@/features/components/orders/DefaultAddressCard";
import { CouponInput } from "@/features/components/orders/CouponInput";
import { CheckoutButton } from "@/features/components/orders/CheckoutButton";

export default function CheckoutPage() {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Credit Card");

  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">Checkout</h1>

      {/* 1. Address Section */}
      <DefaultAddressCard />

      {/* 2. Payment Selector */}
      <div className="mb-4 space-y-1.5">
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700">
          Payment Method
        </label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="Credit Card">Credit Card</option>
          <option value="PayPal">PayPal</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
        </select>
      </div>

      {/* 3. Coupon Input */}
      <CouponInput value={couponCode} onChange={setCouponCode} />

      {/* 4. Action Button */}
      <div className="mt-6">
        <CheckoutButton
          paymentMethod={paymentMethod}
          couponCode={couponCode || undefined}
          onSuccess={() => {
            router.push("/checkout/order-success");
          }}
        />
      </div>
    </main>
  );
}