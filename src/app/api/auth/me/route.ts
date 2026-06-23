import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session/dal";

/** Returns the current user from the session, or null. Used by the client AuthProvider. */
export async function GET(): Promise<NextResponse> {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
