import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as { access?: string; refresh?: string };

  const apiUrl = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL;

  if (body.access && body.refresh) {
    await fetch(`${apiUrl}/users/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${body.access}`,
      },
      body: JSON.stringify({ refresh: body.refresh }),
      cache: "no-store",
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
