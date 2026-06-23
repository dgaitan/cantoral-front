import { NextResponse, type NextRequest } from "next/server";
import { getSongs } from "@/lib/django/queries";
import { routeError, numParam } from "@/lib/django/route";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const sp = req.nextUrl.searchParams;
  try {
    const data = await getSongs({
      page: numParam(sp, "page"),
      search: sp.get("search") ?? undefined,
      tag_id: numParam(sp, "tag_id"),
      author_id: numParam(sp, "author_id"),
    });
    return NextResponse.json(data);
  } catch (err) {
    return routeError(err);
  }
}
