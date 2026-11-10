
"use client";

import { useState } from "react";

import {
  useCategoryList,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/categories/useCategories";

import type { Category } from "@/api/generated/models/categories/category";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSelectCategory,
}: CategoryModalProps) {
  // ----------------------------------------
  // Category Hooks
  // ----------------------------------------

  const {
    categories,
    isLoading,
    refetchCategories,
  } = useCategoryList();

  // Shared success callback.
  const handleCategorySuccess = () => {
    void refetchCategories();
  };

  const {
    createCategory,
    isCreating,
  } = useCreateCategory({
    onSuccess: handleCategorySuccess,
  });

  const {
    updateCategory,
    isUpdating,
  } = useUpdateCategory({
    onSuccess: handleCategorySuccess,
  });

  const {
    deleteCategory,
    isDeleting,
  } = useDeleteCategory({
    onSuccess: handleCategorySuccess,
  });

  // Combined mutation loading state.
  const isMutating = isCreating || isUpdating || isDeleting;

  // ----------------------------------------
  // Local State
  // ----------------------------------------

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // ----------------------------------------
  // Helper Functions
  // ----------------------------------------

  // Generate slug automatically from category name.
  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Handle category name changes.
  const handleNameChange = (value: string) => {
    setName(value);

    if (!editingCategory) {
      setSlug(generateSlug(value));
    }
  };

  // Reset form.
  const resetForm = () => {
    setName("");
    setSlug("");
    setEditingCategory(null);
    setError(null);
  };

  // ----------------------------------------
  // Create / Update Category
  // ----------------------------------------

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isMutating) return;

    setError(null);

    try {
      const categoryData = {
        name: name.trim(),
        slug: slug.trim(),
      };

      if (editingCategory) {
        await updateCategory(editingCategory.slug, categoryData);
      } else {
        await createCategory(categoryData);
      }

      resetForm();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };

      setError(errorObj?.message || "Failed to save category.");
    }
  };

  // ----------------------------------------
  // Edit Category
  // ----------------------------------------

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setError(null);
  };

  // Cancel editing.
  const handleCancelEdit = () => {
    resetForm();
  };

  // ----------------------------------------
  // Delete Category
  // ----------------------------------------

  const handleDeleteClick = async (category: Category) => {
    if (isMutating) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    setError(null);

    try {
      await deleteCategory(category.slug);

      if (editingCategory?.id === category.id) {
        resetForm();
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };

      setError(
        errorObj?.message ||
          "Failed to delete category. It might be tied to existing products."
      );
    }
  };

  // ----------------------------------------
  // Close Modal
  // ----------------------------------------

  const handleClose = () => {
    if (isMutating) return;

    resetForm();
    onClose();
  };

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg space-y-6 rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold text-gray-900">
            Manage Categories
          </h3>

          <button
            type="button"
            onClick={handleClose}
            disabled={isMutating}
            className="font-bold text-gray-500 hover:text-black disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Create / Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-md border bg-gray-50 p-4"
        >
          <h4 className="text-sm font-semibold text-gray-700">
            {editingCategory
              ? `Edit Category: ${editingCategory.name}`
              : "Add New Category"}
          </h4>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              disabled={isMutating}
              required
              className="rounded border bg-white p-2 text-sm disabled:opacity-50"
            />

            <input
              type="text"
              placeholder="Slug (e.g. electronics)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={isMutating}
              required
              className="rounded border bg-white p-2 text-sm disabled:opacity-50"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isMutating || !name.trim() || !slug.trim()}
              className="rounded bg-slate-900 px-4 py-1.5 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMutating
                ? "Saving..."
                : editingCategory
                  ? "Update Category"
                  : "Add Category"}
            </button>

            {editingCategory && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isMutating}
                className="rounded bg-gray-200 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Category List */}
        <div className="max-h-60 space-y-2 overflow-y-auto border-t pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">
              Categories ({categories.length})
            </h4>
          </div>

          {isLoading && (
            <p className="text-sm text-gray-500">
              Loading categories...
            </p>
          )}

          {!isLoading && categories.length === 0 && (
            <p className="text-sm text-gray-500">
              No categories found.
            </p>
          )}

          {!isLoading &&
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-md border bg-white p-2 text-sm"
              >
                {/* Category Information */}
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {category.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {category.slug}
                  </p>
                </div>

                {/* Category Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={isMutating}
                    onClick={() => {
                      onSelectCategory(category.id);
                      handleClose();
                    }}
                    className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                  >
                    Select
                  </button>

                  <button
                    type="button"
                    disabled={isMutating}
                    onClick={() => handleEditClick(category)}
                    className="text-xs text-gray-600 hover:underline disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={isMutating}
                    onClick={() => handleDeleteClick(category)}
                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
