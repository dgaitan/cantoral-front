import { NextResponse, type NextRequest } from "next/server";
import { getPlaylists } from "@/lib/django/queries";
import { routeError, numParam } from "@/lib/django/route";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const page = numParam(req.nextUrl.searchParams, "page") ?? 1;
  try {
    return NextResponse.json(await getPlaylists(page));
  } catch (err) {
    return routeError(err);
  }
}
