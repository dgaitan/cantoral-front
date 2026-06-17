import type { SongPresentationSlide } from "@/types/song";

function TitleSlideContent({ name, authors }: { name: string; authors: string }) {
  return (
    <>
      <h1 className="text-4xl font-bold">{name}</h1>
      <p className="text-lg font-medium">
        <em>{authors}</em>
      </p>
    </>
  );
}

function LyricSlideContent({ label, content }: { label?: string | null; content: string }) {
  return (
    <>
      {label && (
        <p className="font-[var(--font-hanken)] text-[11px] font-bold tracking-[0.14em] uppercase opacity-40 mb-4">
          {label}
        </p>
      )}
      <div
        className="font-[var(--font-newsreader)] leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 w-full max-w-4xl"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}

export function PresentationSlide(slide: SongPresentationSlide) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
      {slide.type === "presentation" ? (
        <TitleSlideContent name={slide.name} authors={slide.authors} />
      ) : (
        <LyricSlideContent label={slide.label} content={slide.content} />
      )}
    </div>
  );
}
