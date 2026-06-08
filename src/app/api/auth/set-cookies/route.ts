import { NextResponse, type NextRequest } from "next/server";

const SECURE = process.env.NODE_ENV === "production";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as { access?: string; refresh?: string };

  if (!body.access || !body.refresh) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("cc_access", body.access, {
    httpOnly: true,
    secure: SECURE,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set("cc_refresh", body.refresh, {
    httpOnly: true,
    secure: SECURE,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
