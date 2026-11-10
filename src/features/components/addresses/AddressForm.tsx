"use client"

import { useState, FormEvent } from "react"
import { useCreateAddress } from "@/hooks/addresses/useAddresses" // Adjust path
import { useUpdateAddress } from "@/hooks/addresses/useAddresses"// Adjust path
import type { AddressRequest } from "@/api/generated/models/addresses/addressRequest"
import type { PatchedAddressRequest } from "@/api/generated/models/addresses/patchedAddressRequest"

interface AddressFormProps {
  addressId?: string // If provided, the form will act as an Update form
  initialData?: PatchedAddressRequest // Pre-fill values when editing
  onSuccess?: () => void
}

export function AddressForm({ addressId, initialData, onSuccess }: AddressFormProps) {
  const isEditing = Boolean(addressId)

  const { createAddress, isCreating } = useCreateAddress()
  const { updateAddress, isUpdating } = useUpdateAddress()

  const isLoadingAction = isCreating || isUpdating

  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState(false)

  // Initialize state directly from props once on mount
  const [formData, setFormData] = useState<AddressRequest>({
    type: initialData?.type || undefined,
    full_name: initialData?.full_name || "",
    phone: initialData?.phone || "",
    street_address: initialData?.street_address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    postal_code: initialData?.postal_code || "",
    country: initialData?.country || "",
    is_default: initialData?.is_default || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(false)

    try {
      if (isEditing && addressId) {
        await updateAddress({
          params: { id: addressId },
          data: formData,
        })
      } else {
        await createAddress(formData)
      }

      setSuccessMessage(true)

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string; response?: { data?: { message?: string } } }
      setError(
        errorObj?.message ||
          errorObj?.response?.data?.message ||
          (isEditing ? "Failed to update address." : "Failed to create address.")
      )
    }
  }

  return (
  <form 
    onSubmit={handleSubmit} 
    className="space-y-5 bg-brav-white p-6 sm:p-8 rounded-2xl border border-brav-border shadow-sm max-w-2xl mx-auto font-sans selection:bg-brav-gold/20"
  >
    {/* Form Heading & Subtitle */}
    <div className="space-y-1">
      <h3 className="font-display text-xl sm:text-2xl font-medium text-brav-charcoal tracking-tight">
        {isEditing ? "Edit Address" : "Add New Address"}
      </h3>
      <p className="font-sans text-xs sm:text-sm text-brav-muted">
        {isEditing ? "Update your address details below." : "Enter your shipping or billing address details below."}
      </p>
    </div>

    {/* Error Alert */}
    {error && (
      <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-700 flex items-start gap-2.5">
        <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p role="alert" className="font-medium leading-relaxed">
          {error}
        </p>
      </div>
    )}

    {/* Success Message Alert */}
    {successMessage && (
      <div className="rounded-xl border border-success/20 bg-success/10 p-3.5 text-xs text-success flex items-start gap-2.5">
        <svg className="w-4 h-4 text-success shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        <p className="font-semibold leading-relaxed">
          {isEditing ? "Address updated successfully!" : "Address added successfully!"}
        </p>
      </div>
    )}

    {/* Full Name & Phone Number Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="full_name"
          maxLength={100}
          required
          value={formData.full_name}
          onChange={handleChange}
          placeholder="John Doe"
          className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          maxLength={20}
          required
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
        />
      </div>
    </div>

    {/* Street Address */}
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
        Street Address <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="street_address"
        required
        value={formData.street_address}
        onChange={handleChange}
        placeholder="123 Main St, Apt 4B"
        className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
      />
    </div>

    {/* City, State & Postal Code Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
          City <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="city"
          maxLength={100}
          required
          value={formData.city}
          onChange={handleChange}
          placeholder="New York"
          className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
          State <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="state"
          maxLength={100}
          required
          value={formData.state}
          onChange={handleChange}
          placeholder="NY"
          className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
          Postal Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="postal_code"
          maxLength={20}
          required
          value={formData.postal_code}
          onChange={handleChange}
          placeholder="10001"
          className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
        />
      </div>
    </div>

    {/* Country & Address Type Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
          Country <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="country"
          maxLength={100}
          required
          value={formData.country}
          onChange={handleChange}
          placeholder="United States"
          className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
          Address Type
        </label>
        <div className="relative">
          <select
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
            className="w-full appearance-none rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200 pr-10"
          >
            <option value="">Select type (Optional)</option>
            <option value="shipping">Shipping</option>
            <option value="billing">Billing</option>
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
    </div>

    {/* Default Address Checkbox */}
    <div className="flex items-center gap-2.5 pt-2">
      <input
        type="checkbox"
        id="is_default"
        name="is_default"
        checked={formData.is_default || false}
        onChange={handleChange}
        className="w-4 h-4 accent-brav-gold border-brav-border rounded focus:ring-brav-gold/20 cursor-pointer"
      />
      <label htmlFor="is_default" className="text-sm text-brav-charcoal font-medium select-none cursor-pointer">
        Set as default address
      </label>
    </div>

    {/* Form Submit Row */}
    <div className="pt-4 border-t border-brav-border flex justify-end">
      <button
        type="submit"
        disabled={isLoadingAction}
        className="px-6 py-3 bg-brav-charcoal hover:bg-brav-dark text-brav-white font-semibold text-sm rounded-xl shadow-md shadow-brav-charcoal/10 focus:outline-none focus:ring-4 focus:ring-brav-gold/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
      >
        {isLoadingAction && (
          <div className="w-4 h-4 border-2 border-brav-gold border-t-transparent rounded-full animate-spin" />
        )}
        <span>{isLoadingAction ? "Saving..." : isEditing ? "Update Address" : "Save Address"}</span>
      </button>
    </div>
  </form>
);
}