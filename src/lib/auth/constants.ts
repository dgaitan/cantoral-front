export const SESSION_COOKIE_NAME = "cc_session" as const;
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const PROTECTED_PATHS = ["/favoritos", "/mis-listas", "/dashboard", "/perfil"] as const;
export const AUTH_PATHS = ["/login", "/register", "/registro", "/verify", "/verificar"] as const;
