"use client";

import { useV1UsersLogoutCreate } from "@/api/generated/endpoints/authentication/authentication";
import type { LogoutRequest } from "@/api/generated/models/authentication/logoutRequest"; // Import your generated LogoutRequest model
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { tokenStore } from "../lib/token-store";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleClearClientSession = () => {
    // 1. Wipe in-memory access token
    tokenStore.clearAccessToken();

    // 2. Clear all cached React Query state (user profile, cart, etc.)
    queryClient.clear();

    // 3. Optional: clear refresh token or user data if stored in localStorage/sessionStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("refresh_token");
      sessionStorage.clear();
    }
  };

  const { mutate, isPending, error } = useV1UsersLogoutCreate({
    mutation: {
      onSuccess: () => {
        // Clear client state regardless so user is not stuck in authenticated state
        handleClearClientSession();
        router.push("/login");
      },
      onError: (err) => {
        console.error("Logout failed:", err);
        // Clear client state regardless so user is not stuck in authenticated state
        handleClearClientSession();
        router.push("/login");
      },
    },
  });

  // Helper wrapper function so callers don't need to manually structure `{ data: ... }`
  const logout = (data: LogoutRequest) => {
    mutate({ data });
  };

  return {
    logout,
    isPending,
    error,
  };
}