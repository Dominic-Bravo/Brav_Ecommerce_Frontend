"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useProducts } from "@/hooks/products/useProducts";
import type { ProductRequest } from "@/api/generated/models/products/productRequest";
import { RoleGuard } from "@/features/auth/providers/role-guard";
import { Product } from "@/api/generated/models/product";
import Image from "next/image";
import { Edit3, Trash2, Plus, PackageOpen, X, AlertTriangle, Layers } from "lucide-react";

export function ProductAdminTable() {
  const {
    products,
    isLoading,
    isDeleting,
    isUpdating,
    deleteProduct,
    updateProduct,
  } = useProducts();

  const router = useRouter();

  // Selection & Modal States
  const [selectedProduct, setSelectedProduct] = useState<ProductRequest | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Form State for Updates
  const [editForm, setEditForm] = useState<Partial<ProductRequest>>({});

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      sku: product.sku,
      image_url: product.image_url,
      category: product.category,
      status: product.status,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteConfirmOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct?.slug) return;

    try {
      await updateProduct(selectedProduct.slug, editForm);
      router.refresh(); 
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct?.slug) return;

    try {
      await deleteProduct(selectedProduct.slug);
      setIsDeleteConfirmOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center font-sans">
        <div className="flex items-center gap-3 bg-brav-surface px-6 py-4 rounded-xl border border-brav-border shadow-xs">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brav-gold border-t-transparent" />
          <p className="text-sm font-medium text-brav-charcoal">Loading catalog management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans selection:bg-brav-gold/20 space-y-8">
      
      {/* Header & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brav-border pb-6">
        <div className="space-y-1">
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-brav-gold">
            Administrative Suite
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight text-brav-charcoal">
            Product Inventory & Catalog
          </h1>
          <p className="text-xs sm:text-sm text-brav-muted">
            Manage product listings, pricing, stock levels, and administrative attributes.
          </p>
        </div>
      </div>

      {/* Product Table Container */}
      <div className="bg-brav-white rounded-2xl border border-brav-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brav-surface border-b border-brav-border text-[11px] font-semibold text-brav-muted uppercase tracking-wider">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">SKU</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brav-border/60 text-xs sm:text-sm">
              {(products as Product[]).map((product) => (
                <tr key={product.slug || product.sku} className="hover:bg-brav-surface/40 transition-colors">
                  
                  {/* Product Details & Image Thumbnail */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-lg bg-brav-surface border border-brav-border overflow-hidden shrink-0 flex items-center justify-center">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name || "Product image"}
                            fill
                            sizes="44px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <PackageOpen className="w-5 h-5 text-brav-muted" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-brav-charcoal truncate max-w-xs">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-brav-muted truncate max-w-xs font-mono">
                          /{product.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-4 px-6 font-mono text-xs text-brav-muted">
                    {product.sku || "N/A"}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 font-semibold text-brav-charcoal">
                    ${Number(product.price).toFixed(2)}
                  </td>

                  {/* Stock Quantity */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      (product.stock_quantity ?? 0) > 0 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}>
                      {product.stock_quantity ?? 0} in stock
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className="capitalize text-xs font-medium text-brav-charcoal">
                      {product.status || "Active"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <RoleGuard allowedRoles={["admin"]}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 rounded-lg bg-brav-surface hover:bg-brav-white border border-brav-border text-brav-charcoal hover:border-brav-gold/50 transition-all shadow-xs"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-brav-gold" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(product)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-all shadow-xs"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        </button>
                      </div>
                    </RoleGuard>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Edit Modal --- */}
      {isEditModalOpen && selectedProduct && (
        <RoleGuard allowedRoles={["admin"]}>
          <div className="fixed inset-0 bg-brav-charcoal/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form onSubmit={handleUpdateSubmit} className="bg-brav-white p-6 sm:p-8 rounded-2xl border border-brav-border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-6">
              
              <div className="flex items-center justify-between border-b border-brav-border pb-4">
                <h3 className="font-display text-xl font-medium text-brav-charcoal">Edit Product</h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg bg-brav-surface border border-brav-border text-brav-muted hover:text-brav-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brav-muted mb-1.5">Name</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-brav-surface border border-brav-border rounded-xl px-4 py-2.5 text-sm text-brav-charcoal focus:outline-none focus:border-brav-gold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brav-muted mb-1.5">Slug</label>
                    <input
                      type="text"
                      maxLength={100}
                      value={editForm.slug || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, slug: e.target.value }))}
                      className="w-full bg-brav-surface border border-brav-border rounded-xl px-4 py-2.5 text-sm text-brav-charcoal focus:outline-none focus:border-brav-gold font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brav-muted mb-1.5">SKU</label>
                    <input
                      type="text"
                      maxLength={50}
                      value={editForm.sku || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, sku: e.target.value }))}
                      className="w-full bg-brav-surface border border-brav-border rounded-xl px-4 py-2.5 text-sm text-brav-charcoal focus:outline-none focus:border-brav-gold font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brav-muted mb-1.5">Price ($)</label>
                    <input
                      type="text"
                      pattern="^-?\d{0,8}(?:\.\d{0,2})?$"
                      value={editForm.price || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                      className="w-full bg-brav-surface border border-brav-border rounded-xl px-4 py-2.5 text-sm text-brav-charcoal focus:outline-none focus:border-brav-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brav-muted mb-1.5">Stock Quantity</label>
                    <input
                      type="number"
                      value={editForm.stock_quantity ?? ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, stock_quantity: e.target.value ? Number(e.target.value) : undefined }))}
                      className="w-full bg-brav-surface border border-brav-border rounded-xl px-4 py-2.5 text-sm text-brav-charcoal focus:outline-none focus:border-brav-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brav-muted mb-1.5">Image URL</label>
                  <input
                    type="text"
                    value={editForm.image_url || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, image_url: e.target.value }))}
                    className="w-full bg-brav-surface border border-brav-border rounded-xl px-4 py-2.5 text-sm text-brav-charcoal focus:outline-none focus:border-brav-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brav-muted mb-1.5">Description</label>
                  <textarea
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-brav-surface border border-brav-border rounded-xl px-4 py-2.5 text-sm text-brav-charcoal focus:outline-none focus:border-brav-gold resize-none"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-brav-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 bg-brav-surface border border-brav-border text-brav-charcoal text-xs font-semibold rounded-xl hover:bg-brav-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-brav-charcoal text-brav-white text-xs font-semibold rounded-xl shadow-xs hover:bg-brav-dark disabled:opacity-50 transition-all"
                >
                  {isUpdating ? "Saving Changes..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </RoleGuard>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {isDeleteConfirmOpen && selectedProduct && (
        <RoleGuard allowedRoles={["admin"]}>
          <div className="fixed inset-0 bg-brav-charcoal/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-brav-white p-6 sm:p-8 rounded-2xl border border-brav-border shadow-2xl w-full max-w-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-lg font-medium text-brav-charcoal">Delete Product</h3>
                <p className="text-xs text-brav-muted leading-relaxed">
                  Are you sure you want to remove <strong className="text-brav-charcoal">{selectedProduct.name}</strong> from the catalog? This action is permanent.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 bg-brav-surface border border-brav-border text-brav-charcoal text-xs font-semibold rounded-xl hover:bg-brav-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-5 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-rose-700 disabled:opacity-50 transition-all"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        </RoleGuard>
      )}

    </div>
  );
}