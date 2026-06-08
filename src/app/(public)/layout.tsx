import { PublicLayout } from "@/components/templates/PublicLayout/PublicLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
