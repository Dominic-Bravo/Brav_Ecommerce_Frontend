"use client"

import { useV1UsersMeRetrieve } from "@/api/generated/endpoints/users/users"
import { useAuthSession } from "../providers/auth-provider";

export function useCurrentUser() {
  const { isInitialized, isAuthenticated } = useAuthSession();

  return useV1UsersMeRetrieve({
    query: {
      enabled: isInitialized && isAuthenticated,
      retry: false,
    },
  });
}
 