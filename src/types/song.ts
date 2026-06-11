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
  tags: Category[];
}

export interface LyricBlock {
  type: "verse" | "chorus" | "bridge";
  content: string; // HTML — <p>…</p> elements
}

export interface SongLyric {
  lyric: LyricBlock[];
  chords: LyricBlock[];
}

export interface Song extends SongListItem {
  plain_lyrics: string | null;
  lyrics: string | null;
  lyrics_with_chords: string | null;
  lyric: SongLyric | null;
  youtube_url: string | null;
  presentation_background_color: string | null;
  presentation_text_color: string | null;
  presentation_font_size: number | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  is_public: boolean;
}
