"use server";

import { cookies } from "next/headers";
import { djangoFetch } from "@/lib/django/client";
import { songIdSchema } from "@/lib/schemas/params";

const VIEW_COOKIE_MAX_AGE = 60 * 60 * 24; // 24h dedup window

/**
 * Registers one view for `songId`, deduped per visitor via an httpOnly
 * cookie (24h window). Fire-and-forget: never throws, and does not
 * revalidate the ISR-cached song page — the hour-long page cache is
 * intentional and views are an eventually-consistent metric.
 */
export async function recordSongView(songId: string): Promise<void> {
  const parsed = songIdSchema.safeParse(songId);
  if (!parsed.success) return;
  const id = parsed.data;

  const cookieName = `sv_${id}`;
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
    await djangoFetch(`/v1/songs/${id}/view/`, { method: "POST" });
  } catch {
    // Swallow: a visitor must never see an error over a view count.
  }
}
