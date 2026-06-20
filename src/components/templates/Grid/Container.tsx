
export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1100px] mx-auto lg:px-8">
      {children}
    </div>
  );
}