import { NextResponse } from "next/server";
import { getSong } from "@/lib/django/queries";
import { routeError } from "@/lib/django/route";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  try {
    return NextResponse.json(await getSong(id));
  } catch (err) {
    return routeError(err);
  }
}
