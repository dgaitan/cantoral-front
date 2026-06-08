"use client";

import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        Bienvenido/a{user?.name ? `, ${user.name}` : ""}
      </h1>
      <p className="text-foreground/60">Este es tu panel personal.</p>
    </div>
  );
}
