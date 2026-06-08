"use client";

import useSWR from "swr";
import { fetchCategories } from "@/lib/api/songs";

export function useCategories() {
  return useSWR("categories", fetchCategories, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
}
