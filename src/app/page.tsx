import { HomeHero } from "@/components/organisms/HomeHero/HomeHero";
import { HomeSections } from "@/components/organisms/HomeSections/HomeSections";
import { Navigation } from "@/components/organisms/Navigation/Navigation";

export default function HomePage() {
  return (
    <div className="bg-paper">
      <Navigation logoStyle="white" showLogo={true} />
      <HomeHero />
      <HomeSections />
      <div className="h-[90px]" />
    </div>
  );
}
