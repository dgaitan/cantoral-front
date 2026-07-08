import type { Metadata } from "next";
import { ListasContent } from "./ListasContent";
import {
  buildCollectionPageJsonLd,
  buildBreadcrumbJsonLd,
  jsonLdHtml,
} from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/seo/site";

const LISTAS_DESCRIPTION =
  "Explora listas públicas de cantos católicos creadas por la comunidad para cada momento de la liturgia.";

export const metadata: Metadata = {
  title: "Listas públicas",
  description: LISTAS_DESCRIPTION,
  alternates: { canonical: "/listas" },
  openGraph: {
    title: "Listas públicas de cantos católicos",
    description: LISTAS_DESCRIPTION,
    url: "/listas",
  },
};

export default function ListasPage() {
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: "Listas públicas de cantos católicos",
    description: LISTAS_DESCRIPTION,
    path: "/listas",
    appUrl: SITE_URL,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: "Inicio", path: "/" },
      { name: "Listas", path: "/listas" },
    ],
    SITE_URL
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumbJsonLd) }}
      />
      <ListasContent />
    </>
  );
}
