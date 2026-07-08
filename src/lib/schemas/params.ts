import { z } from "zod";

/** Django song ids arrive as numeric strings. Rejects path-traversal payloads like "../". */
export const songIdSchema = z.string().regex(/^\d+$/, "ID de canción inválido");

/** Playlist ids are UUIDs. Rejects path-traversal payloads like "../". */
export const uuidSchema = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "ID de lista inválido");
