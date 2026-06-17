interface PresentationLayoutProps {
  children: React.ReactNode;
}

export function PresentationLayout({ children }: PresentationLayoutProps) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      data-testid="presentation-layout"
    >
      {children}
    </div>
  );
}
