import type { Metadata } from "next";
import { Suspense } from "react";
import { ExplorarContent } from "./ExplorarContent";
import {
  buildCollectionPageJsonLd,
  buildBreadcrumbJsonLd,
  jsonLdHtml,
} from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/seo/site";

const EXPLORAR_DESCRIPTION =
  "Explora el catálogo completo de canciones católicas: busca por título, autor o tono y filtra por momento litúrgico.";

export const metadata: Metadata = {
  title: "Explorar",
  description: EXPLORAR_DESCRIPTION,
  alternates: { canonical: "/explorar" },
  openGraph: {
    title: "Explorar cantos católicas",
    description: EXPLORAR_DESCRIPTION,
    url: "/explorar",
  },
};

export default function ExplorarPage() {
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: "Explorar cantos católicas",
    description: EXPLORAR_DESCRIPTION,
    path: "/explorar",
    appUrl: SITE_URL,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: "Inicio", path: "/" },
      { name: "Explorar", path: "/explorar" },
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
      <Suspense>
        <ExplorarContent />
      </Suspense>
    </>
  );
}
