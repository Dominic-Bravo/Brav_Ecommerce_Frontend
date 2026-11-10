"use client";

import { useV1UsersRegisterCreate } from "@/api/generated/endpoints/authentication/authentication";
import { useRouter } from "next/navigation";

export function useRegister() {
  const router = useRouter();

  return useV1UsersRegisterCreate({
    mutation: {
      onSuccess: (data) => {
        // Handle global post-registration logic here (e.g., redirect, invalidate queries, show toast)
        console.log("Registration successful:", data);
        router.push("/login");
      },
      onError: (error) => {
        // Handle global error logging or formatting if needed
        console.error("Registration failed:", error);
      },
    },
  });
}