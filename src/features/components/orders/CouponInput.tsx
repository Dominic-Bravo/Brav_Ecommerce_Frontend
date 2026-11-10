"use client";

interface CouponInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CouponInput({ value, onChange }: CouponInputProps) {
  return (
    <div className="mb-4 space-y-1.5">
      <label htmlFor="coupon" className="block text-sm font-medium text-slate-700">
        Discount Coupon (Optional)
      </label>
      <input
        id="coupon"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder="e.g. SUMMER2026"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase placeholder:normal-case placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}