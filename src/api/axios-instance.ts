import "client-only";

import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { tokenStore } from "@/features/auth/lib/token-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const REFRESH_URL = "/api/v1/users/token/refresh/"; 
const LOGIN_URL = "/api/v1/users/login/";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  access: string;
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Separate client so refresh requests do not trigger the main
// Axios response interceptor.
const refreshClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

export function refreshAccessToken(): Promise<void> {
  
  if (!refreshPromise) {
    console.info("[Auth Debug] Starting refresh request");

    refreshPromise = refreshClient
      .post<RefreshResponse>(REFRESH_URL)
      .then(({ data }) => {
        tokenStore.setAccessToken(data.access);

        console.info("[Auth Debug] Refresh successful");
      })
      .catch((error) => {
        tokenStore.clearAccessToken();

        console.error(
          "[Auth Debug] Refresh failed:",
          error.response?.status,
          error.response?.data,
        );

        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  } else {
    console.info("[Auth Debug] Reusing existing refresh request");
  }

  return refreshPromise;
}

// Attach the access token to authenticated requests.
axiosInstance.interceptors.request.use((config) => {
  const accessToken = tokenStore.getAccessToken();

  console.debug("[Auth Debug] Outgoing request:", {
    url: config.url,
    hasAccessToken: Boolean(accessToken),
  });

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Automatically refresh an expired access token.
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";

    if (
      requestUrl.includes(LOGIN_URL) ||
      requestUrl.includes(REFRESH_URL)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      console.warn(
        "[Auth Debug] 401 detected. Attempting token refresh:",
        originalRequest.url,
      );

      await refreshAccessToken();

      console.info("[Auth Debug] Session restored successfully");

      // The request interceptor attaches the newly refreshed token.
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      if (
        axios.isAxiosError(refreshError) &&
        refreshError.response?.status === 401
      ) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:logout"));
        }
      }

      console.warn("[Auth Debug] No valid session to restore");

      return Promise.reject(refreshError);
    }
  },
);

export const customInstance = async <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await axiosInstance(config);
  return data as T;
};

export default axiosInstance;