import { ReactNode } from "react";
import { Logo } from "@/components/atoms/Logo/Logo";

interface AuthCardProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-sm flex flex-col items-center px-1">
      <div className="mb-7">
        <Logo size={26} />
      </div>
      <h1 className="font-serif text-2xl font-semibold text-ink mb-6 text-center">
        {title}
      </h1>
      {children}
      {footer && <div className="mt-5 text-sm text-muted text-center">{footer}</div>}
    </div>
  );
}
