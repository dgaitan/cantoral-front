import { NextResponse, type NextRequest } from "next/server";
import { getPlaylists } from "@/lib/django/queries";
import { routeError, numParam } from "@/lib/django/route";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const sp = req.nextUrl.searchParams;
  const page = numParam(sp, "page") ?? 1;
  const search = sp.get("search") ?? undefined;
  try {
    return NextResponse.json(await getPlaylists(page, search));
  } catch (err) {
    return routeError(err);
  }
}
