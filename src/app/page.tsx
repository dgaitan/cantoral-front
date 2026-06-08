import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Cancionero Católico</h1>
      <p className="text-lg text-foreground/60 mb-8 max-w-md">
        Letras, acordes y presentaciones para la liturgia y el canto.
      </p>
      <Link
        href="/canciones"
        className="rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/90 transition-colors"
      >
        Ver canciones
      </Link>
    </main>
  );
}
