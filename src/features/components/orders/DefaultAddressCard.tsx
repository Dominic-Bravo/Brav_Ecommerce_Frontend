"use client";

import { useAddress } from "@/hooks/addresses/useAddresses";


export function DefaultAddressCard() {
  const { defaultAddress, hasDefaultAddress, isLoading, error } = useAddress();

  if (isLoading) {
    return (
      <div className="mb-4 animate-pulse rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        Loading default shipping address...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load shipping addresses. Please refresh and try again.
      </div>
    );
  }

  if (!hasDefaultAddress || !defaultAddress) {
    return (
      <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800">
        <p className="font-semibold">⚠️ No default shipping address found!</p>
        <p className="mt-1 text-sm">
          Please add or designate a default shipping address in your profile before checking out.
        </p>
      </div>
    );
  }

  return (
    <div className="relative mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Shipping Address</h3>
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          Default
        </span>
      </div>

      <div className="mt-3 text-sm text-slate-700 space-y-1">
        <p className="font-medium text-slate-900">{defaultAddress.full_name}</p>
        <p className="text-slate-500">{defaultAddress.phone}</p>
        <p>{defaultAddress.street_address}</p>
        <p>
          {defaultAddress.city}, {defaultAddress.state} {defaultAddress.postal_code}, {defaultAddress.country}
        </p>
      </div>
    </div>
  );
}