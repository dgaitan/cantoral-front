"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { djangoFetch } from "@/lib/django/client";
import type { ActionResult } from "@/types/action";
import type { DjangoResponse } from "@/types";
import { ok, fromError } from "./_helpers";

export async function toggleFavorite(
  songId: string,
): Promise<ActionResult<{ is_favorite: boolean }>> {
  try {
    const res = await djangoFetch<DjangoResponse<{ is_favorite: boolean }>>(
      `/v1/songs/${songId}/favorites/`,
      { method: "POST", auth: true },
    );
    revalidateTag(`song-${songId}`, "max");
    revalidatePath("/favoritos");
    return ok(res.data);
  } catch (err) {
    return fromError(err, "No se pudo actualizar el favorito.");
  }
}
