import { NextResponse, type NextRequest } from "next/server";
import { getMyPlaylists } from "@/lib/django/queries";
import { routeError, numParam } from "@/lib/django/route";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const sp = req.nextUrl.searchParams;
  const page = numParam(sp, "page") ?? 1;
  try {
    return NextResponse.json(await getMyPlaylists(page));
  } catch (err) {
    return routeError(err);
  }
}
