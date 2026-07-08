import { NextResponse, type NextRequest } from "next/server";
import { getPlaylistSongs } from "@/lib/django/queries";
import { routeError, numParam } from "@/lib/django/route";
import { uuidSchema } from "@/lib/schemas/params";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse> {
  const { uuid } = await params;
  const parsed = uuidSchema.safeParse(uuid);
  if (!parsed.success) {
    return NextResponse.json({ error: "ID de lista inválido" }, { status: 400 });
  }
  const page = numParam(req.nextUrl.searchParams, "page") ?? 1;
  try {
    return NextResponse.json(await getPlaylistSongs(parsed.data, page));
  } catch (err) {
    return routeError(err);
  }
}
