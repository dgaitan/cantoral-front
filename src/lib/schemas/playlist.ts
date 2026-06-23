import { z } from "zod";

export const createPlaylistSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  is_public: z.boolean(),
  is_collaborative: z.boolean(),
});

export const updatePlaylistSchema = createPlaylistSchema.partial();

export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>;
export type UpdatePlaylistInput = z.infer<typeof updatePlaylistSchema>;
