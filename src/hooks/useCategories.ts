"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { Category } from "@/types";

export function useCategories() {
  return useSWR("/api/categories", () => fetcher<Category[]>("/api/categories"), {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
}
