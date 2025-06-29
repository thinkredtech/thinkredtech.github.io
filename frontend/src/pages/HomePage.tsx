import Hero from '../components/features/home/Hero';
import Services from '../components/features/home/Services';
import TechStack from '../components/features/home/TechStack';
import TeamExpertise from '../components/features/home/TeamExpertise';
import ProcessMethodology from '../components/features/home/ProcessMethodology';
import ProjectHighlights from '../components/features/home/ProjectHighlights';
import CallToAction from '../components/features/home/CallToAction';
import { useSEO, useStructuredData, SEOConfigs, StructuredDataSchemas } from '../hooks/useSEO';

const HomePage = () => {
  // Apply SEO configuration for home page
  useSEO(SEOConfigs.home);

  // Add structured data for organization and website
  useStructuredData(StructuredDataSchemas.organization);
  useStructuredData(StructuredDataSchemas.website);

  return (
    <div>
      <Hero />
      <Services />
      <TechStack />
      <TeamExpertise />
      <ProcessMethodology />
      <ProjectHighlights />
      <CallToAction />
    </div>
  );
};

export default HomePage;
