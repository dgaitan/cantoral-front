import Link from "next/link";
import { Container } from "@/components/templates/Grid/Container";
import { Heading } from "@/components/atoms/Heading/Heading";

export default function NotFound() {
  return (
    <Container as="main" id="contenido" tabIndex={-1} className="px-5 py-24 text-center">
      <Heading size="lg" eyebrow="Error 404">
        No encontramos esta página
      </Heading>
      <p className="text-muted mt-4 mb-8 font-sans max-w-[480px] mx-auto">
        Puede que el enlace esté roto o que la canción haya cambiado de lugar.
      </p>
      <Link href="/" className="button button--primary font-semibold no-underline">
        Volver al inicio
      </Link>
    </Container>
  );
}
