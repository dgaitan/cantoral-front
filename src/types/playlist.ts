import type { SongListItem } from "./song";

export interface PlaylistSong {
  song: SongListItem;
  order: number;
  tune: string | null;
}

export interface Playlist {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_public: boolean;
  likes: number;
  views: number;
  created_at: string;
  songs: PlaylistSong[];
}
