import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as { refresh?: string };

  if (!body.refresh) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const apiUrl = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${apiUrl}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: body.refresh }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }

    const data = (await res.json()) as { access: string };
    return NextResponse.json({ access: data.access });
  } catch {
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }
}
