"use client";

import { useV1CartItemsList, useV1CartItemsCreate, getV1CartItemsListQueryKey, useV1CartItemsPartialUpdate, useV1CartItemsDestroy } from "@/api/generated/endpoints/cart/cart"
import { PaginatedCartItemList } from "@/api/generated/models/cart/paginatedCartItemList"
import z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { V1CartItemsCreateBody, V1CartItemsDestroyParams, V1CartItemsListQueryParams, V1CartItemsPartialUpdateParams } from "@/api/generated/zod/index.zod";
import { useQueryClient } from "@tanstack/react-query";
import { AddCartItemRequest } from "@/api/generated/models/cart/addCartItemRequest";
import { PatchedUpdateCartItemRequest } from "@/api/generated/models/cart/patchedUpdateCartItemRequest";

type DeleteCartParams = z.infer<typeof V1CartItemsDestroyParams>


export function useDeleteCart() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, isError, isSuccess } = useV1CartItemsDestroy({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getV1CartItemsListQueryKey(),
        });
        toast.success("Item removed from cart.");
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to remove item from cart.");
        },
    },
  });

  // Explicitly typing the input using DeleteAddressParams
  const deleteCart = (variables: DeleteCartParams) => {
    mutate(variables);
  };

  const deleteCartAsync = async (variables: DeleteCartParams) => {
    return await mutateAsync(variables);
  };

  return {
    deleteCart,
    deleteCartAsync,
    isDeleting: isPending,
    error,
    isError,
    isSuccess,
  };
}


type UpdateCartParams = z.infer<typeof V1CartItemsPartialUpdateParams>;

type UpdateCartVariables = {
    params: UpdateCartParams;
    data: PatchedUpdateCartItemRequest
}

export function useUpdateCart() {
    const queryClient = useQueryClient();

    const { mutate, mutateAsync, isPending, error, isError, isSuccess } = useV1CartItemsPartialUpdate({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getV1CartItemsListQueryKey(),
                });
            },
        },
    });

    const updateCart = ({ params, data }: UpdateCartVariables) => {
        mutate({ id: params.id, data });
    };

    const updateCartAsync = async ({ params, data }: UpdateCartVariables) => {
    return await mutateAsync({ id: params.id, data });
  };

  return {
    updateCart,
    updateCartAsync,
    isUpdating: isPending,
    error,
    isError,
    isSuccess,
  };

}


export function useCreateCart() {
    const queryClient = useQueryClient();

    const { mutateAsync: createCartMutation, isPending: isCreating } = useV1CartItemsCreate({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getV1CartItemsListQueryKey(),
                });

                // Trigger success toast here!
                toast.success("Item added to your cart successfully.");
            },
            onError: (error) => {
                // Trigger error toast here automatically
                toast.error(error.message || "Failed to add item to cart.");
            },
        },
    });

    const createCart = async (data: AddCartItemRequest) => {
        const validationResult = V1CartItemsCreateBody.safeParse(data);

        if (!validationResult.success) {
            // Using native global Error class
            throw new Error("Validation failed: " + JSON.stringify(validationResult.error.format()));
        }

        return createCartMutation({ data: validationResult.data });
    };

    return {
        createCart,
        isCreating,
    };
}


type CartQueryParam = z.infer<typeof V1CartItemsListQueryParams>

export function useCartList() {
    const [page, setPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const rawParams: CartQueryParam = {
        page,
        search: searchQuery || undefined,
    };
    
    const validationResult = V1CartItemsListQueryParams.safeParse(rawParams);
    const safeParams = validationResult.success ? validationResult.data : { page: 1 };

    const { 
        data: cartListData,
        isLoading,
        isFetching,
        error,
        refetch
     } = useV1CartItemsList(safeParams);

    // FIX: Since cartListData is already the paginated object, use it directly
    const paginatedData = (cartListData as PaginatedCartItemList) ?? {
        count: 0,
        next: null,
        previous: null,
        results: [],
    };

    return {
        carts: paginatedData.results,
        totalCount: paginatedData.count,

        page,
        setPage,
        hasNextPage: Boolean(paginatedData.next),
        hasPreviousPage: Boolean(paginatedData.previous),

        searchQuery,
        setSearchQuery,

        isLoading,
        isFetching,
        error,
        refetch,
    }
}

