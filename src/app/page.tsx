import { HomeHero } from "@/components/organisms/HomeHero/HomeHero";
import { HomeSections } from "@/components/organisms/HomeSections/HomeSections";
import { WithLogoNavigation } from "@/components/organisms/Navigation/WithLogoNavigation";

export default function HomePage() {
  return (
    <div className="bg-paper">
      <WithLogoNavigation withLogo={true} withColorLogo="normal" />
      <HomeHero />
      <HomeSections />
      <div className="h-[90px]" />
    </div>
  );
}
