import type { MetadataRoute } from "next";
import { AUTH_PATHS } from "@/lib/auth/routes";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/favoritos",
          "/mis-listas",
          "/perfil",
          ...AUTH_PATHS,
        ],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
