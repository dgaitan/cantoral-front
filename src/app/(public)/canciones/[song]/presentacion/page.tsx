import type { Metadata } from "next";
import { PresentacionClient } from "./PresentacionClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ song: string }>;
}

export default async function PresentacionPage({ params }: Props) {
  const { song } = await params;
  return <PresentacionClient songParam={song} />;
}
