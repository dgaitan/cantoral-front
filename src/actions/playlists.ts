"use server";

import { revalidatePath } from "next/cache";
import { djangoFetch } from "@/lib/django/client";
import { createPlaylistSchema, updatePlaylistSchema } from "@/lib/schemas/playlist";
import type { ActionResult } from "@/types/action";
import type { DjangoResponse, Playlist } from "@/types";
import { ok, fail, fromError } from "./_helpers";

export async function createPlaylist(input: unknown): Promise<ActionResult<Playlist>> {
  const parsed = createPlaylistSchema.safeParse(input);
  if (!parsed.success) return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  try {
    const res = await djangoFetch<DjangoResponse<Playlist>>("/v1/playlists/", {
      method: "POST",
      auth: true,
      body: { ...parsed.data, description: parsed.data.description || undefined },
    });
    revalidatePath("/mis-listas");
    revalidatePath("/listas");
    return ok(res.data);
  } catch (err) {
    return fromError(err, "No se pudo crear la lista.");
  }
}

export async function updatePlaylist(uuid: string, input: unknown): Promise<ActionResult<Playlist>> {
  const parsed = updatePlaylistSchema.safeParse(input);
  if (!parsed.success) return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  try {
    const res = await djangoFetch<DjangoResponse<Playlist>>(`/v1/playlists/${uuid}/`, {
      method: "POST",
      auth: true,
      body: parsed.data,
    });
    revalidatePath(`/listas/${uuid}`);
    revalidatePath("/mis-listas");
    return ok(res.data);
  } catch (err) {
    return fromError(err, "No se pudo actualizar la lista.");
  }
}

export async function deletePlaylist(uuid: string): Promise<ActionResult> {
  try {
    await djangoFetch<void>(`/v1/playlists/${uuid}/`, { method: "DELETE", auth: true });
    revalidatePath("/mis-listas");
    revalidatePath("/listas");
    return ok(undefined);
  } catch (err) {
    return fromError(err, "No se pudo eliminar la lista.");
  }
}

export async function attachSongs(uuid: string, songIds: number[]): Promise<ActionResult> {
  try {
    await djangoFetch<DjangoResponse<unknown>>(`/v1/playlists/${uuid}/songs/attach/`, {
      method: "POST",
      auth: true,
      body: { song_ids: songIds },
    });
    revalidatePath(`/listas/${uuid}`);
    return ok(undefined);
  } catch (err) {
    return fromError(err, "No se pudo actualizar la lista.");
  }
}

export async function reorderSongs(uuid: string, songIds: number[]): Promise<ActionResult> {
  try {
    await djangoFetch<DjangoResponse<unknown>>(`/v1/playlists/${uuid}/songs/order/`, {
      method: "POST",
      auth: true,
      body: { song_ids: songIds },
    });
    revalidatePath(`/listas/${uuid}`);
    return ok(undefined);
  } catch (err) {
    return fromError(err, "No se pudo reordenar la lista.");
  }
}
