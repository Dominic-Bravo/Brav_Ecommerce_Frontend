"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState, 
} from "react";

import { refreshAccessToken } from "@/api/axios-instance";
import { tokenStore } from "../lib/token-store";
import { useV1UsersMeRetrieve } from "@/api/generated/endpoints/users/users";

import { UserMe } from "@/api/generated/models/userMe";
import { Profile } from "@/api/generated/models/profiles/profile";

export type UserWithProfile = UserMe & Profile;

interface AuthContextValue {
  user: UserWithProfile | null; 
  isLoadingUser: boolean;

  isInitialized: boolean;
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore the session when the application starts.
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // 1. Check if we already have an access token in memory/store
        const existingToken = tokenStore.getAccessToken();

        if (existingToken) {
          if (isMounted) {
            setIsAuthenticated(true);
            setIsInitialized(true);
          }
          return;
        }

        // 2. If no access token exists, try refreshing once 
        // (handles the case where an httpOnly cookie exists from a previous session)
        await refreshAccessToken();

        if (isMounted) {
          setIsAuthenticated(true);
          setIsInitialized(true);
        }
      } catch {
        console.info("[Auth] No active session found on boot.");

        try {
          tokenStore.clearAccessToken();
        } catch (clearError) {
          console.error("[Auth] Failed to clear access token:", clearError);
        }

        if (isMounted) {
          setIsAuthenticated(false);
          setIsInitialized(true);
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for logout events.
  useEffect(() => {
    const handleLogout = () => {
      try {
        tokenStore.clearAccessToken();
      } catch (error) {
        console.error("[Auth] Failed to clear access token:", error);
      }

      setIsAuthenticated(false);
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  // Fetch user details globally once authenticated & initialized
  const { data: userData, isLoading: isLoadingUser } = useV1UsersMeRetrieve({
    query: {
      enabled: isInitialized && isAuthenticated,
      retry: false,
    }, 
  });

  return (
    <AuthContext.Provider
      value={{
        isInitialized,
        isAuthenticated,
        user: (userData as UserWithProfile) ?? null,
        isLoadingUser,
        setAuthenticated: setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthSession must be used within AuthProvider",
    );
  }

  return context;
}