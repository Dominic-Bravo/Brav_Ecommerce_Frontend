'use client';

import { useV1UsersMeUpdate } from "@/api/generated/endpoints/users/users";
import { useV1UsersMeProfilePartialUpdate } from "@/api/generated/endpoints/profiles/profiles";
import { useQueryClient } from "@tanstack/react-query";

export function useUserUpdate() {
  const queryClient = useQueryClient();

  return useV1UsersMeUpdate({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries();
      },
      onError: (error) => {
        console.error("User update failed:", error);
      },
    },
  });
}

export function useProfileUpdate() {
  const queryClient = useQueryClient();

  return useV1UsersMeProfilePartialUpdate({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries();
      },
      onError: (error) => {
        console.error("Profile update failed:", error);
      },
    },
  });
}