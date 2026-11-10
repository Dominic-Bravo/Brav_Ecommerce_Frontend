"use client";

import { RoleGuard } from "@/features/auth/providers/role-guard";
import { ProductAdminTable } from "@/features/components/products/ProductAdminTable"; // adjust path as needed

export default function ProductAdminPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <main className="min-h-screen bg-brav-surface/30">
        <ProductAdminTable />
      </main>
    </RoleGuard>
  );
}