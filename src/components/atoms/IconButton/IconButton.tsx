import { Button } from "@heroui/react";
import { cn } from "@/lib/utils/cn";

interface IconButtonProps {
  onPress?: () => void;
  "aria-label": string;
  children: React.ReactNode;
  className?: string;
}

export function IconButton({
  onPress,
  "aria-label": label,
  children,
  className,
}: IconButtonProps) {
  return (
    <Button
      isIconOnly
      variant="outline"
      onPress={onPress}
      aria-label={label}
      className={cn(
        "w-10 h-10 min-w-10 rounded-xl border border-[var(--line)] bg-white text-[var(--ink)]",
        className
      )}
    >
      {children}
    </Button>
  );
}
