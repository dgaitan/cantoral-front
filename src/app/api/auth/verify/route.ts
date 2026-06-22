import { NextResponse, type NextRequest } from "next/server";
import { buildSetCookieHeader } from "@/lib/auth/session";
import type { User, AuthTokens } from "@/types";

interface DjangoEnvelope<T> {
  data: T;
  success: boolean;
  errors: Record<string, string[]> | null;
}

interface VerifyBody {
  email: string;
  token: string;
  type?: "otp" | "magic";
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as VerifyBody;

  if (!body.email || !body.token) {
    return NextResponse.json({ error: "Missing email or token" }, { status: 400 });
  }

  const apiUrl = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL;
  const endpoint = body.type === "magic" ? "/auth/verify/" : "/auth/verify";

  const verifyRes = await fetch(`${apiUrl}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, token: body.token }),
    cache: "no-store",
  });

  if (!verifyRes.ok) {
    const err = (await verifyRes.json().catch(() => ({}))) as { errors?: unknown };
    return NextResponse.json(
      { error: "Verificación fallida", errors: err.errors ?? null },
      { status: verifyRes.status }
    );
  }

  const verifyData = (await verifyRes.json()) as DjangoEnvelope<AuthTokens>;
  if (!verifyData.success || !verifyData.data) {
    return NextResponse.json({ error: "Verificación fallida" }, { status: 401 });
  }

  const { access_token, refresh_token } = verifyData.data;

  const profileRes = await fetch(`${apiUrl}/v1/profile`, {
    headers: { Authorization: `Bearer ${access_token}` },
    cache: "no-store",
  });

  if (!profileRes.ok) {
    return NextResponse.json({ error: "No se pudo obtener el perfil" }, { status: 500 });
  }

  const profileData = (await profileRes.json()) as DjangoEnvelope<User>;

  const response = NextResponse.json({ user: profileData.data, access: access_token });
  response.headers.set("Set-Cookie", buildSetCookieHeader(refresh_token));
  return response;
}
