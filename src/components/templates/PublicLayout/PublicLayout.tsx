import { Navbar } from "@/components/organisms/Navbar/Navbar";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-default-200 py-6 text-center text-xs text-foreground/40">
        © {new Date().getFullYear()} Cancionero Católico
      </footer>
    </>
  );
}
