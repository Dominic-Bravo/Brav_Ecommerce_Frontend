"use client"

import { PaginatedOrderList } from "@/api/generated/models/orders/paginatedOrderList"
import { getV1OrdersListQueryKey, useV1OrdersCheckoutCreate, useV1OrdersList, useV1OrdersRetrieve } from "@/api/generated/endpoints/orders/orders"
import { getV1CartItemsListQueryKey } from "@/api/generated/endpoints/cart/cart";
import { useState } from "react";
import { Order } from "@/api/generated/models/orders/order";
import { useQueryClient } from "@tanstack/react-query";
import { V1OrdersCheckoutCreateBody } from "@/api/generated/zod/index.zod";
import z from "zod";
import { toast } from "sonner";

export type CheckoutRequest = z.infer<typeof V1OrdersCheckoutCreateBody>;

export function useCheckoutOrder() {
    const queryClient = useQueryClient();

    const { mutateAsync: createCheckoutMutation, isPending: isCreating } =
        useV1OrdersCheckoutCreate({
            mutation: {
                onSuccess: async () => {
                    await Promise.all([
                        // Refresh cart list
                        queryClient.invalidateQueries({
                            queryKey: getV1CartItemsListQueryKey(),
                        }),

                        // Refresh orders list
                        queryClient.invalidateQueries({
                            queryKey: getV1OrdersListQueryKey(),
                        }),
                    ]);

                    // Success Toast
                    toast.success("Order placed successfully!");
                },
                onError: (err) => {
                    // Error Toast for network or server-side failures
                    toast.error(err?.message || "Failed to process checkout. Please try again.");
                },
            },
        });

    const createCheckout = async (data: CheckoutRequest) => {
        const validationResult = V1OrdersCheckoutCreateBody.safeParse(data);

        if (!validationResult.success) {
            throw new Error(
                "Validation failed: " +
                JSON.stringify(validationResult.error.format())
            );
        }

        return createCheckoutMutation({
            data: validationResult.data,
        });
    };

    return {
        createCheckout,
        isCreating,
    };
}


export function useOrderRetrieve(orderId: string | null) {
    const {
        data: order,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useV1OrdersRetrieve(orderId as string, {
        query: {
            // Only fire the query if an orderId is provided
            enabled: Boolean(orderId),
        },
    });

    return {
        order: order as Order | undefined,
        isLoading,
        isFetching,
        error,
        refetch,
    };
}

export function useOrder() {
    const [page, setPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Paginated Orders List Query
    const { 
        data: orderListData, 
        isLoading, 
        isFetching,
        error,
        refetch 
    } = useV1OrdersList({
        page,
        search: searchQuery || undefined,
    });

    const paginatedData: PaginatedOrderList = orderListData ?? {
        count: 0,
        next: null,
        previous: null,
        results: [],
    };

    return {
        // Data
        orders: paginatedData.results,
        totalCount: paginatedData.count,
        
        // Pagination state & helpers
        page,
        setPage,
        hasNextPage: Boolean(paginatedData.next),
        hasPreviousPage: Boolean(paginatedData.previous),

        // Search state & helpers
        searchQuery,
        setSearchQuery,

        // Status & actions
        isLoading,
        isFetching,
        error,
        refetch,
    };
}