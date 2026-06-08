export interface Author {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface SongListItem {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  image: string | null;
  has_lyrics: boolean;
  views: number | null;
  likes: number | null;
  tone: string | null;
  created_at: string | null;
  updated_at: string | null;
  authors: Author[];
  categories: Category[];
}

export interface Song extends SongListItem {
  lyrics: string | null;
  lyrics_with_chords: string | null;
  lyric: unknown | null;
  youtube_url: string | null;
  presentation_background_color: string | null;
  presentation_text_color: string | null;
  presentation_font_size: number | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  is_public: boolean;
}
