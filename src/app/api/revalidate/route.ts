import { timingSafeEqual } from "crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get("token");
  const expected = process.env.REVALIDATE_TOKEN;
  if (!expected || !token || !safeCompare(token, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { songId?: string | number };
  if (!body.songId) {
    return NextResponse.json({ error: "songId is required" }, { status: 400 });
  }

  const tag = `song-${body.songId}`;
  revalidateTag(tag, "max");
  return NextResponse.json({ revalidated: true, tag });
}
