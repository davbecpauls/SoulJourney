import { Navigation } from "@/components/navigation";
import { CosmicHero } from "@/components/cosmic-hero";
import { LearningPaths } from "@/components/learning-paths";
import { AcademyStructure } from "@/components/academy-structure";
import { FeaturesSection } from "@/components/features-section";
import { ManagementSection } from "@/components/management-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen mystical-background text-white relative">
      <div className="cosmic-particles"></div>
      <Navigation />
      <CosmicHero />
      <LearningPaths />
      <AcademyStructure />
      <FeaturesSection />
      <ManagementSection />
      <CTASection />
      <Footer />
    </div>
  );
}
