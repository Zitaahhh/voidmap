import { HeroScene } from "@/components/HeroScene";
import { explorerProfile, signals } from "@/data/signals";

export default function Home() {
  return <HeroScene profile={explorerProfile} signals={signals} />;
}
