import { NextResponse, type NextRequest } from "next/server";
import { getPlaylistSongs } from "@/lib/django/queries";
import { routeError, numParam } from "@/lib/django/route";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse> {
  const { uuid } = await params;
  const page = numParam(req.nextUrl.searchParams, "page") ?? 1;
  try {
    return NextResponse.json(await getPlaylistSongs(uuid, page));
  } catch (err) {
    return routeError(err);
  }
}
