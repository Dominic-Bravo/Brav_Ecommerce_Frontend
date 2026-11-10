"use client";

import { useQueryClient } from "@tanstack/react-query"
import { getV1UsersAddressesListQueryKey, useV1UsersAddressesCreate, useV1UsersAddressesList, useV1UsersAddressesDestroy, useV1UsersAddressesPartialUpdate } from "@/api/generated/endpoints/addresses/addresses"
import { PaginatedAddressList } from "@/api/generated/models/addresses/paginatedAddressList"
import { useState } from "react";
import { z } from "zod";
import { AddressRequest } from "@/api/generated/models/addresses/addressRequest";
import { V1UsersAddressesCreateBody, V1UsersAddressesDestroyParams, V1UsersAddressesListQueryParams, V1UsersAddressesPartialUpdateParams } from "@/api/generated/zod/index.zod";
import { PatchedAddressRequest } from "@/api/generated/models/addresses/patchedAddressRequest";
import { Address } from "@/api/generated/models/addresses/address";

type AddressQueryParams = z.infer<typeof V1UsersAddressesListQueryParams>;
type DeleteAddressParams = z.infer<typeof V1UsersAddressesDestroyParams>;
type UpdateAddressParams = z.infer<typeof V1UsersAddressesPartialUpdateParams>;


export function useDeleteAddress() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, isError, isSuccess } = useV1UsersAddressesDestroy({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getV1UsersAddressesListQueryKey(),
        });
      },
    },
  });

  // Explicitly typing the input using DeleteAddressParams
  const deleteAddress = (variables: DeleteAddressParams) => {
    mutate(variables);
  };

  const deleteAddressAsync = async (variables: DeleteAddressParams) => {
    return await mutateAsync(variables);
  };

  return {
    deleteAddress,
    deleteAddressAsync,
    isDeleting: isPending,
    error,
    isError,
    isSuccess,
  };
}


type UpdateAddressVariables = {
  params: UpdateAddressParams; // Contains the id: { id: string }
  data: PatchedAddressRequest; // Contains the fields you want to update
};

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, isError, isSuccess } = useV1UsersAddressesPartialUpdate({
    mutation: {
      onSuccess: () => {
        // Invalidate and refetch the addresses list cache after a successful update
        queryClient.invalidateQueries({
          queryKey: getV1UsersAddressesListQueryKey(),
        });
      },
    },
  });

  const updateAddress = ({ params, data }: UpdateAddressVariables) => {
    mutate({ id: params.id, data });
  };

  const updateAddressAsync = async ({ params, data }: UpdateAddressVariables) => {
    return await mutateAsync({ id: params.id, data });
  };

  return {
    updateAddress,
    updateAddressAsync,
    isUpdating: isPending,
    error,
    isError,
    isSuccess,
  };
}


// 1. Isolated Hook for Creating Addresses
export function useCreateAddress() {
    const queryClient = useQueryClient();

    const { mutateAsync: createAddressMutation, isPending: isCreating } = useV1UsersAddressesCreate({
        mutation: {
            onSuccess: () => {
                // Uses Orval's generated query key automatically
                queryClient.invalidateQueries({ 
                    queryKey: getV1UsersAddressesListQueryKey() 
                });
            },
        },
    });

    const createAddress = async (data: AddressRequest) => {
        // Optional: Validate data using Orval's Zod schema before sending
        const validationResult = V1UsersAddressesCreateBody.safeParse(data);
        
        if (!validationResult.success) {
            throw new Error("Validation failed: " + JSON.stringify(validationResult.error.format()));
        }

        return createAddressMutation({ data: validationResult.data });
    }

    return {
        // Wrap it here so your form can pass `AddressRequest` directly
        createAddress,
        isCreating,
    }
}


export function useAddress() {
    const [page, setPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Construct the query object using the inferred Zod type
    const rawParams: AddressQueryParams = {
        page,
        search: searchQuery || undefined,
    };

    // Optional runtime validation using Orval's Zod schema
    const validationResult = V1UsersAddressesListQueryParams.safeParse(rawParams);
    const safeParams = validationResult.success ? validationResult.data : { page: 1 };

    // Fetch data using validated parameters
    const { data: response, isLoading, isFetching, error, refetch } = useV1UsersAddressesList(safeParams);

    // Safely cast response to handle your backend's wrapper structure ({ message, data })
    const responseWrapper = response as unknown as { 
        message?: string; 
        data?: PaginatedAddressList 
    };

    const paginatedData = responseWrapper?.data ?? {
        count: 0,
        next: null,
        previous: null,
        results: [],
    };

    const addresses = paginatedData.results ?? [];

    // 1. Find the default address where is_default is true
    const defaultAddress = addresses.find((addr: Address) => addr.is_default === true);
    
    // 2. Check if a default address exists
    const hasDefaultAddress = Boolean(defaultAddress);
    
    return {
        address: paginatedData.results ?? [],
        defaultAddress,       // The single default Address object (or undefined)
        hasDefaultAddress,    // Boolean flag to easily check if default exists
        totalCount: paginatedData.count ?? 0,

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
    };
}