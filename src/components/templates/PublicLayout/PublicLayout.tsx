import { Navbar } from "@/components/organisms/Navbar/Navbar";
import { Navigation } from "@/components/organisms/Navigation/Navigation";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      {/* <Navbar /> */}
      <Navigation logoStyle="normal" showLogo={true} />
      <main className="flex-1 pt-12">{children}</main>
    </>
  );
}
