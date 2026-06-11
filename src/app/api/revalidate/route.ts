import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get("token");
  if (!process.env.REVALIDATE_TOKEN || token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { songId?: string | number };
  if (!body.songId) {
    return NextResponse.json({ error: "songId is required" }, { status: 400 });
  }

  const tag = `song-${body.songId}`;
  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, tag });
}
