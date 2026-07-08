"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { djangoFetch } from "@/lib/django/client";
import { songIdSchema } from "@/lib/schemas/params";
import type { ActionResult } from "@/types/action";
import type { DjangoResponse } from "@/types";
import { ok, fail, fromError } from "./_helpers";

export async function toggleFavorite(
  songId: string,
): Promise<ActionResult<{ is_favorite: boolean }>> {
  const parsed = songIdSchema.safeParse(songId);
  if (!parsed.success) return fail("ID de canción inválido");
  const id = parsed.data;

  try {
    const res = await djangoFetch<DjangoResponse<{ is_favorite: boolean }>>(
      `/v1/songs/${id}/favorites/`,
      { method: "POST", auth: true },
    );
    revalidateTag(`song-${id}`, "max");
    revalidatePath("/favoritos");
    return ok(res.data);
  } catch (err) {
    return fromError(err, "No se pudo actualizar el favorito.");
  }
}
