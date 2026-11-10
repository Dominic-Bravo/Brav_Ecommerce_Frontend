"use client"

import { useAddress } from "@/hooks/addresses/useAddresses" // Adjust path to your query hook
import { useDeleteAddress } from "@/hooks/addresses/useAddresses"// FIXED: Import from useDeleteAddress file
import { Address } from "@/api/generated/models/addresses/address" // Adjust based on your model path
import { useState } from "react"
import { AddressForm } from "./AddressForm"

export function AddressList() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const {
    address: addresses = [], // Fallback to an empty array immediately
    totalCount = 0,
    page,   
    setPage,
    hasNextPage,
    hasPreviousPage,
    searchQuery,
    setSearchQuery,
    isLoading,
    isFetching,
    error,
  } = useAddress()

  // Initialize the delete mutation hook
  const { deleteAddress } = useDeleteAddress()

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return

    setDeletingId(id)
    try {
      await deleteAddress({ id })
    } catch (err) {
      console.error("Failed to delete address:", err)
    }
  }

  if (error) {
  return (
    <div className="p-6 text-center text-red-700 bg-red-50/70 rounded-2xl border border-red-200 font-sans">
      <p className="font-semibold text-sm">Failed to load addresses</p>
      <p className="text-xs text-red-600 mt-1">Please try again later.</p>
    </div>
  );
}

return (
  <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 font-sans selection:bg-brav-gold/20">
    {/* Header & Search Bar */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brav-border pb-6">
      <div className="space-y-1">
        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-brav-charcoal">
          My Addresses
        </h2>
        <p className="font-sans text-xs sm:text-sm text-brav-muted">
          Manage your shipping and billing locations ({totalCount} total)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="w-full sm:w-64 relative">
          <input
            type="text"
            placeholder="Search addresses..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-brav-surface border border-brav-border rounded-xl placeholder:text-brav-muted text-brav-charcoal focus:outline-none focus:border-brav-gold focus:bg-brav-white focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setIsFormOpen((prev) => !prev);
            setEditingId(null); // Close any active edits when opening create form
          }}
          className="w-full sm:w-auto px-5 py-2.5 bg-brav-charcoal hover:bg-brav-dark text-brav-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-brav-charcoal/10 focus:outline-none focus:ring-4 focus:ring-brav-gold/20 active:scale-[0.99] transition-all duration-200 whitespace-nowrap"
        >
          {isFormOpen && !editingId ? "Cancel" : "+ Add Address"}
        </button>
      </div>
    </div>    

    {/* Conditionally Render Create Address Form */}
    {isFormOpen && !editingId && (
      <div className="mb-6 p-6 bg-brav-white rounded-2xl border border-brav-border shadow-sm transition-all">
        <AddressForm 
          onSuccess={() => setIsFormOpen(false)} 
        />
      </div>
    )}

    {/* Loading State (Initial Load) */}
    {isLoading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((n) => (
          <div key={n} className="h-48 bg-brav-surface rounded-2xl animate-pulse border border-brav-border" />
        ))}
      </div>
    ) : addresses.length === 0 ? (
      /* Empty State */
      <div className="text-center py-16 bg-brav-surface rounded-2xl border border-dashed border-brav-border p-6">
        <p className="text-brav-charcoal font-medium text-sm">No addresses found.</p>
        <p className="text-xs text-brav-muted mt-1">
          {searchQuery ? "Try adjusting your search query." : "Add your first address to get started."}
        </p>
      </div>
    ) : (
      /* Address Grid */
      <div className="relative">
        {isFetching && (
          <div className="absolute inset-0 bg-brav-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl transition-all">
            <div className="w-6 h-6 border-2 border-brav-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr: Address) => (
            <div key={addr.id} className="col-span-1">
              {editingId === addr.id ? (
                /* Edit Form for this specific address */
                <div className="p-5 bg-brav-surface rounded-2xl border border-brav-gold/40 shadow-sm">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-brav-border">
                    <span className="text-xs font-semibold text-brav-gold uppercase tracking-wider">Editing Address</span>
                    <button 
                      type="button" 
                      onClick={() => setEditingId(null)}
                      className="text-xs text-brav-muted hover:text-brav-charcoal font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <AddressForm
                    key={addr.id}
                    addressId={addr.id}
                    initialData={addr}
                    onSuccess={() => setEditingId(null)}
                  />
                </div>
              ) : (
                /* Normal Address Card View */
                <div
                  className={`relative flex flex-col justify-between p-6 bg-brav-white rounded-2xl border transition-all duration-300 hover:shadow-md h-full ${
                    addr.is_default 
                      ? "border-brav-gold shadow-sm ring-1 ring-brav-gold/30" 
                      : "border-brav-border hover:border-brav-gold/40"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-sans font-semibold text-brav-charcoal text-base">{addr.full_name}</h3>
                      {addr.is_default && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider bg-brav-gold/15 text-brav-gold border border-brav-gold/30">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="text-xs sm:text-sm font-sans text-brav-muted space-y-1">
                      <p>{addr.street_address}</p>
                      <p>
                        {addr.city}, {addr.state} {addr.postal_code}
                      </p>
                      <p className="font-semibold text-brav-charcoal pt-0.5">{addr.country}</p>
                      <p className="pt-2 text-brav-muted flex items-center gap-1.5 text-xs">
                        <span className="font-semibold text-brav-charcoal">Phone:</span> {addr.phone}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brav-border flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(addr.id);
                        setIsFormOpen(false); // Close the create form if open
                      }}
                      className="text-xs font-semibold text-brav-charcoal hover:text-brav-gold transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === addr.id}
                      onClick={() => handleDelete(addr.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors flex items-center gap-1"
                    >
                      {deletingId === addr.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Pagination Controls */}
    {totalCount > 0 && (
      <div className="flex items-center justify-between pt-6 border-t border-brav-border">
        <p className="text-xs sm:text-sm font-sans text-brav-muted">
          Page <span className="font-semibold text-brav-charcoal">{page}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={!hasPreviousPage || isFetching}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-brav-charcoal bg-brav-surface border border-brav-border rounded-xl hover:bg-brav-white hover:border-brav-gold/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNextPage || isFetching}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-brav-charcoal bg-brav-surface border border-brav-border rounded-xl hover:bg-brav-white hover:border-brav-gold/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>
    )}
  </div>
);
}