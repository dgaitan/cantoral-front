export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      id="contenido"
      tabIndex={-1}
      className="min-h-screen flex items-center justify-center px-4"
    >
      {children}
    </main>
  );
}
