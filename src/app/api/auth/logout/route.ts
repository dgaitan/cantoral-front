import { NextResponse, type NextRequest } from "next/server";
import { decodeSessionCookie, buildClearCookieHeader } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = rawCookie ? decodeSessionCookie(rawCookie) : null;

  const body = (await req.json().catch(() => ({}))) as { access?: string };
  const apiUrl = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL;

  if (body.access && session?.refreshToken) {
    await fetch(`${apiUrl}/users/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${body.access}`,
      },
      body: JSON.stringify({ refresh: session.refreshToken }),
      cache: "no-store",
    }).catch(() => {});
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", buildClearCookieHeader());
  return response;
}
