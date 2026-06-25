import { Navbar } from "@/components/organisms/Navbar/Navbar";
import { Navigation } from "@/components/organisms/Navigation/Navigation";
import { Footer } from "@/components/organisms/Footer/Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      {/* <Navbar /> */}
      <Navigation logoStyle="normal" showLogo={true} />
      <main id="contenido" tabIndex={-1} className="flex-1 pt-12 lg:pt-[68px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
