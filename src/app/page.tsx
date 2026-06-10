import { HomeHero } from "@/components/organisms/HomeHero/HomeHero";
import { HomeSections } from "@/components/organisms/HomeSections/HomeSections";

export default function HomePage() {
  return (
    <div className="bg-paper">
      <HomeHero />
      <HomeSections />
      <div className="h-[90px]" />
    </div>
  );
}
