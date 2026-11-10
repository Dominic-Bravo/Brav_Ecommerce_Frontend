"use client";

import { useAddress } from "@/hooks/addresses/useAddresses";
import { useCheckoutOrder } from "@/hooks/orders/useOrders";



interface CheckoutButtonProps {
  paymentMethod?: string;
  couponCode?: string;
  onSuccess?: () => void;
}

export function CheckoutButton({
  paymentMethod = "Credit Card",
  couponCode,
  onSuccess,
}: CheckoutButtonProps) {
  const { defaultAddress, hasDefaultAddress, isLoading: isLoadingAddress } = useAddress();
  const { createCheckout, isCreating } = useCheckoutOrder();

  const handleCheckout = async () => {
    if (!hasDefaultAddress || !defaultAddress) {
      alert("Cannot place order: No default shipping address available.");
      return;
    }

    try {
      await createCheckout({
        address_id: defaultAddress.id,
        payment_method: paymentMethod,
        coupon_code: couponCode?.trim() || undefined,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        alert("Order placed successfully!");
      }
    } catch (error: unknown) {
      console.error("Checkout failed:", error);
      
      // Safely extract the error message without using 'any'
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while placing your order.";

      alert(errorMessage);
    }
  };

  const isDisabled = isCreating || isLoadingAddress || !hasDefaultAddress;

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isDisabled}
      className={`w-full rounded-md px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors ${
        isDisabled
          ? "cursor-not-allowed bg-slate-300 text-slate-500"
          : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
      }`}
    >
      {isCreating
        ? "Processing Order..."
        : isLoadingAddress
        ? "Checking Shipping Address..."
        : "Place Order"}
    </button>
  );
}