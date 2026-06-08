import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

const SECURE = process.env.NODE_ENV === "production";

export async function POST(_req: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("cc_refresh")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const apiUrl = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${apiUrl}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: "no-store",
    });

    if (!res.ok) {
      const response = NextResponse.json({ error: "Refresh failed" }, { status: 401 });
      response.cookies.delete("cc_access");
      response.cookies.delete("cc_refresh");
      return response;
    }

    const body = (await res.json()) as { access: string };
    const response = NextResponse.json({ access: body.access });

    response.cookies.set("cc_access", body.access, {
      httpOnly: true,
      secure: SECURE,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    const response = NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    response.cookies.delete("cc_access");
    response.cookies.delete("cc_refresh");
    return response;
  }
}
