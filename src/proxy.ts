import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { decryptSession } from "@/lib/session/crypto";
import { isProtectedPath, isAuthPath } from "@/lib/auth/routes";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const session = await decryptSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  const isAuthed = Boolean(session);

  if (isProtectedPath(pathname) && !isAuthed) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath(pathname) && isAuthed) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
