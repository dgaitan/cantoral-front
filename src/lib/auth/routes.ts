/** Central public/protected/auth route map. Source of truth for middleware guards. */

export const PROTECTED_PATHS = ["/favoritos", "/mis-listas", "/dashboard", "/perfil"] as const;
export const AUTH_PATHS = ["/login", "/register", "/registro", "/verify", "/verificar"] as const;

function matches(pathname: string, paths: readonly string[]): boolean {
  return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isProtectedPath(pathname: string): boolean {
  return matches(pathname, PROTECTED_PATHS);
}

export function isAuthPath(pathname: string): boolean {
  return matches(pathname, AUTH_PATHS);
}
