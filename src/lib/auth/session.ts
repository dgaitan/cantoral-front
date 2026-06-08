import { cookies } from "next/headers";

export async function getServerSession(): Promise<{
  accessToken: string;
} | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("cc_access")?.value;
  if (!accessToken) return null;
  return { accessToken };
}
