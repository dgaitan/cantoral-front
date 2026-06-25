import { ReactNode } from "react";
import { Logo } from "@/components/atoms/Logo/Logo";
import { Heading } from "@/components/atoms/Heading/Heading";

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
      <Heading className="mb-6 text-center">{title}</Heading>
      {children}
      {footer && <div className="mt-5 text-sm text-muted text-center">{footer}</div>}
    </div>
  );
}
