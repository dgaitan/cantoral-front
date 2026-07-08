import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_LANG } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Cancionero",
    description: SITE_TAGLINE,
    lang: SITE_LANG,
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f1",
    theme_color: "#0a1d2b",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
