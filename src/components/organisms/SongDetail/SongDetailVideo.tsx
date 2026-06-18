import { Play } from "lucide-react";
import { SectionHead } from "@/components/molecules/SectionHead/SectionHead";
import type { SongDetailVideoProps } from "@/types/song";

export function SongDetailVideo({ youtubeUrl: _ }: SongDetailVideoProps) {
  return (
    <div data-testid="video-section" className="mb-8">
      <SectionHead kicker="Video" title="Escuchar" />
      <div className="bg-[var(--ink)] rounded-2xl aspect-video flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-[var(--orange)] flex items-center justify-center">
          <Play size={24} fill="white" color="white" />
        </div>
      </div>
    </div>
  );
}
