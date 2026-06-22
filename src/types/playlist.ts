import type { SongListItem } from "./song";

export interface PlaylistSong {
  song: SongListItem;
  order: number;
}

export interface Playlist {
  uuid: string;
  name: string;
  description: string | null;
  is_public: boolean;
  is_collaborative: boolean;
  owner_id: number;
  created_at: string;
  updated_at: string;
  songs_count?: number;
}

export interface CreatePlaylistPayload {
  name: string;
  description?: string;
  is_public?: boolean;
  is_collaborative?: boolean;
}

export interface UpdatePlaylistPayload extends Partial<CreatePlaylistPayload> {}
