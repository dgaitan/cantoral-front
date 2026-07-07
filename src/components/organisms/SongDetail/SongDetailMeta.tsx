import { Eye, Heart, KeyRound } from "lucide-react";
import { formatCompactNumber } from "@/lib/utils/format";
import type { SongDetailMetaProps } from "@/types/song";

type MetaStatProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function MetaStat({ icon, label, value }: MetaStatProps) {
  return (
    <div className="flex flex-col gap-[3px]">
      <span className="flex items-center gap-[5px] font-[family-name:var(--font-hanken)] text-[11px] font-semibold tracking-[0.10em] uppercase text-[var(--muted)]">
        {icon}
        {label}
      </span>
      <span className="font-[family-name:var(--font-newsreader)] text-[18px] font-semibold text-[var(--ink)]">
        {value}
      </span>
    </div>
  );
}

export function SongDetailMeta({ displayKey, views, likes }: SongDetailMetaProps) {
  return (
    <div className="flex gap-[18px] pb-4">
      {displayKey && (
        <MetaStat icon={<KeyRound size={15} />} label="Tono" value={displayKey} />
      )}
      {views != null && (
        <MetaStat icon={<Eye size={15} />} label="Vistas" value={formatCompactNumber(views)} />
      )}
      {likes != null && (
        <MetaStat
          icon={<Heart size={15} />}
          label="Me gusta"
          value={likes.toLocaleString("es")}
        />
      )}
    </div>
  );
}
