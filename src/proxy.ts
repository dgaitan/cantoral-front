import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, PROTECTED_PATHS, AUTH_PATHS } from "@/lib/auth/constants";

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !hasSession) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
