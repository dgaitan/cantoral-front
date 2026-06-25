import type { Metadata } from "next";
import { HomeHero } from "@/components/organisms/HomeHero/HomeHero";
import { HomeSections } from "@/components/organisms/HomeSections/HomeSections";
import { Navigation } from "@/components/organisms/Navigation/Navigation";
import { buildWebSiteJsonLd, jsonLdHtml } from "@/lib/utils/seo";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = buildWebSiteJsonLd(SITE_URL);

  return (
    <div className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
      <Navigation logoStyle="white" showLogo={true} />
      <main id="contenido" tabIndex={-1}>
        <HomeHero />
        <HomeSections />
      </main>
      <div className="h-[90px]" />
    </div>
  );
}
