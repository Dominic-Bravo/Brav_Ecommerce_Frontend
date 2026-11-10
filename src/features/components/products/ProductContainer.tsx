// app/products/_components/ProductContainer.tsx
"use client";

import { useProducts } from "../../../hooks/products/useProducts";
import ProductForm from "./ProductForm";
import { ProductList } from "./ProductCrud";
import { RoleGuard } from "@/features/auth/providers/role-guard"; // Adjust path if needed

export default function ProductContainer() {
  const {
    isCreating, 
    createProduct,
  } = useProducts();

  return (
    <div className="space-y-8">
      {/* Product Creation Form - Restricted to Admin Only */}
      <RoleGuard 
        allowedRoles={["admin", "customer"]}
        fallbackComponent={null} // Renders nothing for non-admins (or replace with a custom message if desired)
      >
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Create New Product</h2>
          <ProductForm 
            onSubmit={async (data) => {
              try {
                await createProduct(data);
              } catch (err) {
                console.error("Failed to create product:", err);
              }
            }} 
            isSubmitting={isCreating} 
          />
        </div>
      </RoleGuard>

      {/* Product List (Visible to all users, action buttons inside are guarded) */}
      <ProductList />
    </div>
  );
}