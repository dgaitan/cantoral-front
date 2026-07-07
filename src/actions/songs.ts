"use server";

import { cookies } from "next/headers";
import { djangoFetch } from "@/lib/django/client";

const VIEW_COOKIE_MAX_AGE = 60 * 60 * 24; // 24h dedup window

/**
 * Registers one view for `songId`, deduped per visitor via an httpOnly
 * cookie (24h window). Fire-and-forget: never throws, and does not
 * revalidate the ISR-cached song page — the hour-long page cache is
 * intentional and views are an eventually-consistent metric.
 */
export async function recordSongView(songId: string): Promise<void> {
  // Django ids arrive as numbers at runtime despite the `Song.id: string` type.
  const safeId = String(songId).replace(/[^a-zA-Z0-9_-]/g, "");
  const cookieName = `sv_${safeId}`;
  const cookieStore = await cookies();

  if (cookieStore.get(cookieName)) return;

  cookieStore.set(cookieName, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: VIEW_COOKIE_MAX_AGE,
  });

  try {
    await djangoFetch(`/v1/songs/${songId}/view/`, { method: "POST" });
  } catch {
    // Swallow: a visitor must never see an error over a view count.
  }
}
