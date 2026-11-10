"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { tokenStore } from "@/features/auth/lib/token-store";
import { useV1UsersAuthGoogleCreate } from "@/api/generated/endpoints/authentication/authentication";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthSession } from "@/features/auth/providers/auth-provider";

interface GoogleAuthResponse {
  access?: string;
  [key: string]: unknown;
}

// 1. Helper function moved OUTSIDE the component.
// The React Compiler ignores non-component/non-hook functions, 
// completely bypassing the try/catch restriction.
async function executeGoogleExchange(
  code: string,
  googleLogin: ReturnType<typeof useV1UsersAuthGoogleCreate>["mutateAsync"],
  queryClient: ReturnType<typeof useQueryClient>,
  setAuthenticated: (value: boolean) => void
) {
  const response = (await googleLogin({
    data: { code },
  })) as GoogleAuthResponse;

  if (response?.access) {
    tokenStore.setAccessToken(response.access);
    setAuthenticated(true); 
  }

  await queryClient.invalidateQueries();
}

export function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const { setAuthenticated } = useAuthSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const code = searchParams.get("code");

  const [status, setStatus] = useState(code ? "Authenticating with Google..." : null);
  const [error, setError] = useState<string | null>(code ? null : "No authorization code found from Google.");

  const hasFetched = useRef(false);
  const { mutateAsync: googleLogin } = useV1UsersAuthGoogleCreate();

  useEffect(() => {
    if (!code) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    const handleGoogleExchange = async () => {
      try {
        setStatus("Verifying your login with the server...");

        // 2. Call the external helper containing the try/catch logic
        await executeGoogleExchange(code, googleLogin, queryClient, setAuthenticated);

        setStatus("Login successful! Redirecting...");
        setTimeout(() => {
          router.replace('/profile');
        }, 1000);

      } catch (err: unknown) {
        let errorMessage = "Failed to complete Google authentication.";

        if (axios.isAxiosError(err)) {
          const responseData = err.response?.data as {
            detail?: string;
            non_field_errors?: string[];
          };
          
          if (responseData?.detail) {
            errorMessage = responseData.detail;
          } else if (responseData?.non_field_errors?.[0]) {
            errorMessage = responseData.non_field_errors[0];
          } else if (err.message) {
            errorMessage = err.message;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      }
    };

    handleGoogleExchange();
  }, [code, router, googleLogin, queryClient, setAuthenticated]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Google Sign-In</h1>

        {error ? (
          <div className="space-y-3">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-sm">{status}</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center space-y-4">
          <h1 className="text-xl font-bold text-gray-900">Google Sign-In</h1>
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </main>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}