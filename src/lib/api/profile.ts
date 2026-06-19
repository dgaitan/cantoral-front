import type { DjangoResponse, User } from "@/types";
import { apiClient } from "./client";
import { useAuthStore } from "@/store/authStore";

export async function fetchUserProfile(): Promise<DjangoResponse<User>> {
    const { data } = await apiClient.get<DjangoResponse<User>>("/v1/profile");
    return data;
}

export async function getCurrentUser(): Promise<User | null> {
    const { user, setUser } = useAuthStore.getState();
    if (user) return user;

    const response = await fetchUserProfile();
    if (response.success && response.data) {
        setUser(response.data);
        return response.data;
    }

    return null;
}