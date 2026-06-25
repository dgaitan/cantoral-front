/**
 * Central site-level SEO constants. Single source of truth for the name,
 * description, canonical origin and locale used across metadata, JSON-LD,
 * the sitemap and the OpenGraph image.
 */

export const SITE_NAME = "Cancionero Católico";

export const SITE_DESCRIPTION =
  "Letras, acordes y tonos de canciones católicas para cada momento de la liturgia. Listo para cantar, listo para proyectar.";

export const SITE_TAGLINE = "Letras y acordes de canciones católicas";

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** OpenGraph locale (underscore form). */
export const SITE_LOCALE = "es_ES";

/** html lang / JSON-LD inLanguage (BCP-47). */
export const SITE_LANG = "es";

export const DEFAULT_KEYWORDS = [
  "cancionero católico",
  "letras de canciones católicas",
  "acordes",
  "cantos para misa",
  "música católica",
  "liturgia",
  "cantos litúrgicos",
];
