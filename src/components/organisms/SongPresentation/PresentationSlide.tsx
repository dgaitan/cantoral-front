import type { SongPresentationSlide } from "@/types/song";

function StandardContent({ label, content }: Omit<SongPresentationSlide, "song" | "type">) {
  return (
    <>
      {label && (
        <p className="font-[var(--font-hanken)] text-[11px] font-bold tracking-[0.14em] uppercase opacity-40 mb-4">
          {label}
        </p>
      )}
      <div
        className="font-[var(--font-newsreader)] leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 w-full max-w-4xl"
        dangerouslySetInnerHTML={{ __html: content ?? "" }}
      />
    </>
  );
}

function SongPresentationSlide({ song }: Omit<SongPresentationSlide, "label" | "content" | "type">) {
  return (
    <>
        <h1 className="text-4xl font-bold">{song.name}</h1>
        <p className="text-lg font-medium"><em>M,L: {song.authors?.map((author) => author.name).join(", ")}</em></p>
    </>
  );
}

export function PresentationSlide({ label, content, song, type }: SongPresentationSlide) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            {type === "presentation" 
                ? <SongPresentationSlide song={song} /> 
                : <StandardContent label={label} content={content} />
            }
        </div>
    );
}