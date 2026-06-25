"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        Bienvenido/a{user?.name ? `, ${user.name}` : ""}
      </h1>
      <p className="text-foreground/60">Este es tu panel personal.</p>
    </div>
  );
}
