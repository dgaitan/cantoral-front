import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(_req: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("cc_refresh")?.value;
  const accessToken = cookieStore.get("cc_access")?.value;

  const apiUrl = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL;

  if (refreshToken && accessToken) {
    await fetch(`${apiUrl}/users/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: "no-store",
    }).catch(() => {
      // Best-effort — clear cookies regardless
    });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("cc_access");
  response.cookies.delete("cc_refresh");
  return response;
}
