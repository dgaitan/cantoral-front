import { NextResponse } from "next/server";
import { getSong } from "@/lib/django/queries";
import { routeError } from "@/lib/django/route";
import { songIdSchema } from "@/lib/schemas/params";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const parsed = songIdSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: "ID de canción inválido" }, { status: 400 });
  }
  try {
    return NextResponse.json(await getSong(parsed.data));
  } catch (err) {
    return routeError(err);
  }
}
