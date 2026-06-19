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
  is_favorited?: boolean;
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
  lyrics: SongLyric | null;
  lyrics_with_chords: string | null;
  youtube_url: string | null;
  presentation_background_color: string | null;
  presentation_text_color: string | null;
  presentation_font_size: number | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  is_public: boolean;
}

// ── Presentation ─────────────────────────────────────────────────────────────

/** First slide: shows song title and author credits. */
export interface PresentationTitleSlide {
  type: "presentation";
  name: string;
  authors: string; // pre-formatted, e.g. "M,L: David A. Mijares"
}

/** Subsequent slides: one verse / chorus / bridge per slide. */
export interface PresentationLyricSlide {
  type: "standard";
  label?: string | null;
  content: string;
}

export type SongPresentationSlide = PresentationTitleSlide | PresentationLyricSlide;

export interface SongPresentationProps {
  slides: SongPresentationSlide[];
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
}

export interface PresentationProgressBarProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

// ── SongDetail child props ────────────────────────────────────────────────────

export interface SongDetailProps {
  song: Song;
  presentacionHref: string;
}

export interface SongDetailTopBarProps {
  onBack: () => void;
  songId: string;
  songSlug: string;
  songTitle: string;
  isFavorited: boolean;
}

export interface SongDetailHeaderProps {
  song: Song;
}

export interface SongDetailMetaProps {
  displayKey: string;
  views: number | null;
  likes: number | null;
}

export interface SongDetailActionsProps {
  presentacionHref: string;
}

export interface SongDetailVideoProps {
  youtubeUrl: string;
}

export interface SongDetailSimilarProps {
  songs: SongListItem[];
  categoryName?: string;
}

export interface SongLyricsRendererProps {
  lyrics: SongLyric;
  showChords: boolean;
  steps?: number;
  fontSize?: number;
  dark?: boolean;
}
