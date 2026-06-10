import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { setOrRemoveLocalStorageItem, getLocalStorageItem } from "@/lib/utils/helpers";

const ACCESS_TOKEN_KEY = "cc_access_token";
const REFRESH_TOKEN_KEY = "cc_refresh_token";
let memoryToken: string | null = getLocalStorageItem(ACCESS_TOKEN_KEY);


export function setMemoryToken(token: string | null): void {
  memoryToken = token;
  setOrRemoveLocalStorageItem(ACCESS_TOKEN_KEY, token);
}

export function getMemoryToken(): string | null {
  return memoryToken;
}

export function setRefreshToken(token: string | null): void {
  setOrRemoveLocalStorageItem(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  return getLocalStorageItem(REFRESH_TOKEN_KEY);
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null): void {
  for (const p of failedQueue) {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token!);
    }
  }
  failedQueue = [];
}

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (memoryToken) {
    config.headers.Authorization = `Bearer ${memoryToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (err: unknown) => {
    if (!axios.isAxiosError(err)) return Promise.reject(err);

    const original = err.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        processQueue(new Error("No refresh token"), null);
        setMemoryToken(null);
        isRefreshing = false;
        return Promise.reject(err);
      }

      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        if (!res.ok) throw new Error("Refresh failed");
        const body = (await res.json()) as { access: string };
        setMemoryToken(body.access);
        processQueue(null, body.access);
        original.headers.Authorization = `Bearer ${body.access}`;
        return apiClient(original);
      } catch (err) {
        processQueue(err, null);
        setMemoryToken(null);
        setRefreshToken(null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export { apiClient };
