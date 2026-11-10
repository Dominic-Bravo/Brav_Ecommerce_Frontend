"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useProducts } from "@/hooks/products/useProducts";
import type { ProductRequest } from "@/api/generated/models/products/productRequest";
import { RoleGuard } from "@/features/auth/providers/role-guard";
import { Product } from "@/api/generated/models/product";
import { ProductCard } from "./ProductCard";

export function ProductList() {
  const {
    products,
    isLoading,
    isDeleting,
    isUpdating,
    deleteProduct,
    updateProduct,
  } = useProducts();

  const router = useRouter();

  // Modal & Selection State
  const [selectedProduct, setSelectedProduct] = useState<ProductRequest | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Form State for Updates
  const [editForm, setEditForm] = useState<Partial<ProductRequest>>({});

  const handleImageClick = (product: ProductRequest) => {
    setSelectedProduct(product);
    setIsActionModalOpen(true);
  };

  const handleOpenEdit = () => {
    if (!selectedProduct) return;
    setEditForm({
      name: selectedProduct.name,
      slug: selectedProduct.slug,
      description: selectedProduct.description,
      price: selectedProduct.price,
      stock_quantity: selectedProduct.stock_quantity,
      sku: selectedProduct.sku,
      image_url: selectedProduct.image_url,
      category: selectedProduct.category,
      status: selectedProduct.status,
    });
    setIsActionModalOpen(false);
    setIsEditModalOpen(true);
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
      setIsActionModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Products</h2>

      {/* Grid of Products using isolated ProductCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(products as Product[]).map((product) => (
          <ProductCard
            key={product.slug || product.sku}
            product={product}
            onImageClick={handleImageClick}
          />
        ))}
      </div>

      {/* --- Action Selection Modal --- */}
      {isActionModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">Manage Product</h3>
            <p className="text-sm text-gray-500 mb-4">{selectedProduct.name}</p>
            
            <RoleGuard 
              allowedRoles={["admin"]} 
              fallbackComponent={
                <p className="text-sm text-red-500 bg-red-50 p-3 rounded mb-4 text-center">
                  Only administrators can edit or delete products.
                </p>
              }
            >
              <div className="space-y-3 mb-3">
                <button
                  onClick={handleOpenEdit}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  Edit Product
                </button>
                <button
                  onClick={() => {
                    setIsActionModalOpen(false);
                    setIsDeleteConfirmOpen(true);
                  }}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                >
                  Delete Product
                </button>
              </div>
            </RoleGuard>

            <button
              onClick={() => setIsActionModalOpen(false)}
              className="w-full py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {isEditModalOpen && selectedProduct && (
        <RoleGuard allowedRoles={["admin"]}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10">
            <form onSubmit={handleUpdateSubmit} className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">Edit Product</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={editForm.slug || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="text"
                    pattern="^-?\d{0,8}(?:\.\d{0,2})?$"
                    value={editForm.price || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input
                    type="text"
                    maxLength={50}
                    value={editForm.sku || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, sku: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editForm.stock_quantity ?? ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, stock_quantity: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editForm.image_url || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, image_url: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </RoleGuard>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {isDeleteConfirmOpen && selectedProduct && (
        <RoleGuard allowedRoles={["admin"]}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm">
              <h3 className="text-lg font-bold text-red-600 mb-2">Delete Product</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedProduct.name}</strong>? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </RoleGuard>
      )}
    </div>
  );
}