import { NextResponse, type NextRequest } from "next/server";
import { decodeSessionCookie, buildSetCookieHeader } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = rawCookie ? decodeSessionCookie(rawCookie) : null;

  if (!session?.refreshToken) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const apiUrl = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${apiUrl}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: session.refreshToken }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }

    const data = (await res.json()) as { access: string; refresh?: string };
    const newRefreshToken = data.refresh ?? session.refreshToken;

    const response = NextResponse.json({ access: data.access });
    response.headers.set("Set-Cookie", buildSetCookieHeader(newRefreshToken));
    return response;
  } catch {
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }
}
