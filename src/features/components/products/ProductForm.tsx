// app/products/_components/ProductForm.tsx
"use client";

import { useState } from "react";
import { ProductStatusEnum } from "@/api/generated/models/productStatusEnum";
import { ProductRequest } from "@/api/generated/models/products/productRequest";
import { useCategoryList } from "../../../hooks/categories/useCategories";
import CategoryModal from "./CategoryModal";

interface ProductFormProps {
  onSubmit: (data: ProductRequest) => Promise<void>;
  isSubmitting: boolean;
}

export default function ProductForm({ onSubmit, isSubmitting }: ProductFormProps) {
  const { categories, isLoading: isLoadingCategories } = useCategoryList();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [formData, setFormData] = useState<ProductRequest>({
    name: "",
    slug: "",
    description: "",
    price: "0.00",
    stock_quantity: 0,
    sku: "",
    image_url: "",
    category: "",
    status: ProductStatusEnum.active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ProductRequest = {
      ...formData,
      price: Number(formData.price).toFixed(2),
      stock_quantity: Number.isNaN(formData.stock_quantity) ? 0 : Number(formData.stock_quantity),
    };

    await onSubmit(payload);  
    
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "0.00",
      stock_quantity: 0,
      sku: "",
      image_url: "",
      category: "",
      status: ProductStatusEnum.active,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-lg shadow-sm space-y-4 mb-8">
        <h2 className="text-lg font-bold">Add New Product</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border p-2 text-sm"
            />
          </div>

          {/* Category Dropdown + Manage Button */}
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                + Manage Categories
              </button>
            </div>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              disabled={isLoadingCategories}
              className="mt-1 block w-full rounded-md border p-2 text-sm bg-white"
            >
              <option value="">{isLoadingCategories ? "Loading categories..." : "Select a category"}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
            <input
              type="number"
              min="0"
              step="1"
              value={Number.isNaN(formData.stock_quantity) ? "" : formData.stock_quantity}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ 
                  ...formData, 
                  stock_quantity: val === "" ? NaN : parseInt(val, 10) 
                });
              }}
              required
              className="mt-1 block w-full rounded-md border p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              value={formData.image_url ?? ""}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatusEnum })}
              className="mt-1 block w-full rounded-md border p-2 text-sm bg-white"
            >
              {Object.entries(ProductStatusEnum).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border p-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.category}
          className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50 text-sm font-medium"
        >
          {isSubmitting ? "Saving..." : "Create Product"}
        </button>
      </form>

      {/* Category Modal Component */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSelectCategory={(categoryId) => setFormData({ ...formData, category: categoryId })}
      />
    </>
  );
}