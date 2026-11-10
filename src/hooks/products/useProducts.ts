"use client";

import { useState } from "react";
import {
  useV1ProductsProductsList,
  useV1ProductsProductsCreate,
  useV1ProductsProductsDestroy,
  useV1ProductsProductsPartialUpdate,
} from "@/api/generated/endpoints/products/products";
import type { ProductRequest } from "@/api/generated/models/products/productRequest";
import type { PaginatedProductList } from "@/api/generated/models/products/paginatedProductList";

interface UseProductsOptions {
  category?: string;
}

export function useProducts(options?: UseProductsOptions) {
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: productListData,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    error: productsError,
    refetch,
  } = useV1ProductsProductsList({
    page,
    search: searchQuery || undefined,
    category: options?.category || undefined,
  });

  const { mutateAsync: destroyProduct, isPending: isDeleting } =
    useV1ProductsProductsDestroy({
      mutation: {
        onSuccess: () => {
          refetch();
        },
      },
    });

  const {
    mutateAsync: partialUpdateProduct,
    isPending: isUpdating,
  } = useV1ProductsProductsPartialUpdate({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    },
  });

  const {
    mutateAsync: createProduct,
    isPending: isCreating,
  } = useV1ProductsProductsCreate({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    },
  });

  const paginatedData: PaginatedProductList = productListData ?? {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };

  return {
    products: paginatedData.results,
    totalCount: paginatedData.count,
    hasNextPage: Boolean(paginatedData.next),
    hasPreviousPage: Boolean(paginatedData.previous),

    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    isCreating,
    isDeleting,
    isUpdating,
    error: productsError,

    createProduct: (newProduct: ProductRequest) =>
      createProduct({ data: newProduct }),

    deleteProduct: (slug: string) =>
      destroyProduct({ slug }),

    updateProduct: (slug: string, data: Partial<ProductRequest>) =>
      partialUpdateProduct({ slug, data }),

    setPage,
    setSearchQuery,
    refetchProducts: refetch,
  };
}