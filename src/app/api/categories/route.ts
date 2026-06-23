import { NextResponse } from "next/server";
import { getCategories } from "@/lib/django/queries";
import { routeError } from "@/lib/django/route";

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json(await getCategories());
  } catch (err) {
    return routeError(err);
  }
}
