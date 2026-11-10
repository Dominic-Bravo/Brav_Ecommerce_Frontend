"use client"

import { useV1ProductsCategoriesCreate } from "@/api/generated/endpoints/categories/categories";
import { useV1ProductsCategoriesList } from "@/api/generated/endpoints/categories/categories";
import { useV1ProductsCategoriesPartialUpdate } from "@/api/generated/endpoints/categories/categories";
import { useV1ProductsCategoriesDestroy } from "@/api/generated/endpoints/categories/categories";

import { CategoryRequest } from "@/api/generated/models/categories/categoryRequest";
import { PatchedCategoryRequest } from "@/api/generated/models/categories/patchedCategoryRequest";
import { Category } from "@/api/generated/models/categories/category";
import { useState } from "react";
import { V1ProductsCategoriesListParams } from "@/api/generated/models/categories/v1ProductsCategoriesListParams";


interface PaginatedCategoryResponse {
  results: Category[];
  count?: number;
}

export function useCategoryList() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const params: V1ProductsCategoriesListParams = {
    search: searchQuery || undefined,
  };

  const {
    data: categoryListData,
    isLoading,
    error,
    refetch,
  } = useV1ProductsCategoriesList(params);

  const categories: Category[] = (() => {
    if (!categoryListData) return [];
    if (Array.isArray(categoryListData)) {
      return categoryListData;
    }
    const paginated = categoryListData as unknown as PaginatedCategoryResponse;
    return paginated.results ?? [];
  })();

  return {
    categories,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    refetchCategories: refetch,
  };
}


interface UseCreateCategoryOptions {
  onSuccess?: () => void;
}

export function useCreateCategory(options?: UseCreateCategoryOptions) {
  const { mutateAsync, isPending, error } = useV1ProductsCategoriesCreate({
    mutation: {
      onSuccess: () => {
        options?.onSuccess?.();
      },
    },
  });

  const createCategory = (data: CategoryRequest) => mutateAsync({ data });

  return {
    createCategory,
    isCreating: isPending,
    error,
  };
}

interface UseUpdateCategoryOptions {
  onSuccess?: () => void;
}

export function useUpdateCategory(options?: UseUpdateCategoryOptions) {
  const { mutateAsync, isPending, error } = useV1ProductsCategoriesPartialUpdate({
    mutation: {
      onSuccess: () => {
        options?.onSuccess?.();
      },
    },
  });

  const updateCategory = (slug: string, data: PatchedCategoryRequest) =>
    mutateAsync({ slug, data });

  return {
    updateCategory,
    isUpdating: isPending,
    error,
  };
}


interface UseDeleteCategoryOptions {
  onSuccess?: () => void;
}

export function useDeleteCategory(options?: UseDeleteCategoryOptions) {
  const { mutateAsync, isPending, error } = useV1ProductsCategoriesDestroy({
    mutation: {
      onSuccess: () => {
        options?.onSuccess?.();
      },
    },
  });

  const deleteCategory = (slug: string) => mutateAsync({ slug });

  return {
    deleteCategory,
    isDeleting: isPending,
    error,
  };
}