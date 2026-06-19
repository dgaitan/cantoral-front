"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Share2, Mail, Link2 } from "lucide-react";
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverDialog } from "@heroui/react";
import { cn } from "@/lib/utils/cn";
import { buildSongParam } from "@/lib/utils/song-param";
import { FacebookIcon, WhatsAppIcon, TwitterXIcon } from "./social-icons";

type SvgIcon = (props: { size?: number }) => React.JSX.Element;

type ShareOption = {
  id: string;
  label: string;
  icon: SvgIcon | LucideIcon;
  getUrl?: (url: string, title: string) => string;
};

const OPTIONS: ShareOption[] = [
  {
    id: "facebook",
    label: "Facebook",
    icon: FacebookIcon,
    getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: WhatsAppIcon,
    getUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    id: "twitter",
    label: "Twitter / X",
    icon: TwitterXIcon,
    getUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    getUrl: (url, title) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
  { id: "copy", label: "Copiar enlace", icon: Link2 },
];

interface ShareButtonProps {
  songId: string;
  songSlug: string;
  songTitle: string;
  className?: string;
}

export function ShareButton({ songId, songSlug, songTitle, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleOption(option: ShareOption) {
    const url = `${window.location.origin}/canciones/${buildSongParam(songId, songSlug)}`;
    if (option.getUrl) {
      window.open(option.getUrl(url, songTitle), "_blank", "noopener,noreferrer");
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <PopoverRoot>
      <PopoverTrigger
        aria-label="Compartir canción"
        className={cn(
          "w-10 h-10 min-w-10 rounded-xl border border-[var(--line)] bg-white text-[var(--ink)]",
          "flex items-center justify-center cursor-pointer hover:bg-default-100 transition-colors",
          className
        )}
      >
        <Share2 size={18} />
      </PopoverTrigger>
      <PopoverContent placement="bottom end">
        <PopoverDialog>
          <div className="py-1 min-w-[180px]">
            {OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOption(option)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-default-100 transition-colors text-left"
                >
                  <Icon size={18} />
                  <span>{option.id === "copy" && copied ? "¡Copiado!" : option.label}</span>
                </button>
              );
            })}
          </div>
        </PopoverDialog>
      </PopoverContent>
    </PopoverRoot>
  );
}
