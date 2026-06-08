import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

let memoryToken: string | null = null;

export function setMemoryToken(token: string | null): void {
  memoryToken = token;
}

export function getMemoryToken(): string | null {
  return memoryToken;
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
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !original._retry) {
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

      try {
        const res = await fetch("/api/auth/refresh", { method: "POST" });
        if (!res.ok) throw new Error("Refresh failed");
        const body = (await res.json()) as { access: string };
        setMemoryToken(body.access);
        processQueue(null, body.access);
        original.headers.Authorization = `Bearer ${body.access}`;
        return apiClient(original);
      } catch (err) {
        processQueue(err, null);
        setMemoryToken(null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };
