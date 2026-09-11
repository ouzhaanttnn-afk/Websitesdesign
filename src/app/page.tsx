import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { PriceTeaser } from "@/components/home/PriceTeaser";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { ContactCta } from "@/components/home/ContactCta";
import { Divider } from "@/components/ui/Divider";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <PriceTeaser />
      <AboutTeaser />
      <Divider />
      <ContactCta />
    </>
  );
}
